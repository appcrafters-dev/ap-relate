import { UserRoles } from "lib/models/enums";

export function getSupabaseClient(client) {
  return new SupabaseClient(client);
}

class SupabaseClient {
  constructor(client) {
    this.client = client;
  }

  async getCurrentAuthUser() {
    const { data } = await this.client.auth.getUser();
    return data?.user || null;
  }

  async getCurrentUser() {
    const user = await this.getCurrentAuthUser();
    if (!user) return null;

    const userMeta = user?.user_metadata;

    const { data: profiles = [], error: profilesError } =
      await this.getUserProfiles(user.id);

    // we add the following fields to the user object:
    user.profile = null; // the user's default profile
    user.profiles = profiles; // all the user's profiles, with roles and families/partners
    user.family = null; // the user's default family
    user.families = []; // all the user's families
    user.partner = null; // the user's default partner
    user.partners = []; // all the user's partners

    if (profilesError) {
      console.error("Error getting user profiles", profilesError);
      return user;
    }

    user.profile =
      profiles.find((p) => p.id === userMeta?.default_user_profile?.id) ||
      profiles[0] ||
      null;

    const { data: families = [], error: familiesError } =
      await this.getFamilies();

    if (familiesError) {
      console.error("Error getting families", familiesError);
      return user;
    }

    user.families = families;
    user.family =
      user.families.find((f) => f.id === user.profile.family_id) ||
      families[0] ||
      null;

    // Get partners if the user is a partner admin
    if (user.profiles.some((p) => p.role === UserRoles.PartnerAdmin)) {
      const { data: partners = [], error: partnersError } =
        await this.getPartnersForProfiles(user.profiles);

      if (partnersError) {
        console.error("Error getting partners", partnersError);
        return user;
      }

      user.partners = partners;
      user.partner =
        user.partners.find((p) => p.id === user.profile.partner_id) ||
        partners[0] ||
        null;
    }

    return user;
  }

  async getFamilies() {
    const fields = `
      id,
      family_name,
      status,
      billing_method,
      stripe_customer_id,
      coach:assigned_coach_id(id, short_bio, ...user_roles(role, ...user_profiles(first_name, last_name, email))),
      family_members(*, ...user_roles(role, ...user_profiles(first_name, last_name, email))),
      partner:partner_id(id, company_legal_name)
      `;

    return await this.client.from("families").select(fields);
  }

  async getPartnersForProfiles(profiles) {
    if (!profiles) return { partners: [] };

    console.log("Getting partners for user");

    const { data: partnerMembers, error } = await this.client
      .from("partner_members")
      .select(`*, partner:partner_id(*)`)
      .in(
        "id",
        profiles.map((up) => up.id)
      );

    if (error) return { error };

    return { data: partnerMembers.map((pm) => pm.partner) };
  }

  async getUserProfiles(userId) {
    console.info("Getting user profiles for user", userId);
    return this.client
      .from("user_profiles_view")
      .select()
      .eq("user_id", userId);
  }

  async getFamilyMembers(familyId) {
    return this.client
      .from("user_profiles_view")
      .select()
      .eq("family_id", familyId)
      .or(`role.eq.${UserRoles.HeadOfHousehold}, role.eq.${UserRoles.Child}`);
  }

  async getUserProfile(id) {
    return this.client
      .from("user_profiles_view")
      .select()
      .eq("id", id)
      .single();
  }

  async getFamilyMember(id) {
    return this.client
      .from("family_members")
      .select(
        `
      *,
      ...user_roles(*, ...user_profiles(*))
      partner_spouse:partner_spouse_id(*, ...user_roles(*, ...user_profiles(*)))
      `
      )
      .eq("id", id)
      .single();
  }

  async getGuidePage(slugPath) {
    // Try to fetch an article
    const { data: articleData, error: articleError } = await this.client
      .from("guide_articles")
      .select(`*, category:guide_categories(*)`)
      .eq("slug_path", slugPath)
      .maybeSingle();

    if (articleError) return { data: null, error: articleError };
    if (articleData) return { data: articleData, error: null };

    // If no article was found, try to fetch a category
    const { data: categoryData, error: categoryError } = await this.client
      .from("guide_categories")
      .select(`*, guide_articles(*), parent_category:parent_id(*)`)
      .eq("slug_path", slugPath)
      .maybeSingle();

    if (categoryError) return { data: null, error: categoryError };
    if (categoryData) return { data: categoryData, error: null };

    return { data: null, error: null };
  }

  async getGuideAdminPage(table, id) {
    if (table !== "articles" && table !== "categories") {
      return { data: null, error: "Invalid table" };
    }

    return this.client
      .from(`guide_${table}`)
      .select(
        table === "articles" ? "*, guide_categories(*)" : "*, guide_articles(*)"
      )
      .eq("id", id)
      .single();
  }
}

export function buildQuery(query, searchParams) {
  // Parse the searchParams object
  const parsedSearchParams = {};
  let sortColumn = null;
  let sortOrder = null;

  for (const [key, value] of Object.entries(searchParams)) {
    if (key === "sort_asc" || key === "sort_desc") {
      sortColumn = value;
      sortOrder = key === "sort_asc" ? "asc" : "desc";
    } else {
      let [column, operator] = key.split(".");
      if (!operator) {
        operator = "eq";
      }
      if (!parsedSearchParams[column]) {
        parsedSearchParams[column] = {};
      }
      parsedSearchParams[column][operator] = value;
    }
  }

  // Build the query based on parsedSearchParams
  for (const [key, value] of Object.entries(parsedSearchParams)) {
    if (value.like) {
      query = query.ilike(key, `%${value.like}%`);
    } else if (value.exact) {
      query = query.eq(key, value.exact);
    } else if (value.gt) {
      query = query.gt(key, value.gt);
    } else if (value.lt) {
      query = query.lt(key, value.lt);
    } else if (value.gte) {
      query = query.gte(key, value.gte);
    } else if (value.lte) {
      query = query.lte(key, value.lte);
    } else if (value.is) {
      query = query.is(key, value.is);
    } else if (value.in) {
      query = query.in(key, value.in);
    } else if (value.neq) {
      query = query.neq(key, value.neq);
    } else if (value.contains) {
      query = query.contains(key, value.contains);
    } else if (value.containedBy) {
      query = query.containedBy(key, value.containedBy);
    } else if (value.eq) {
      query = query.eq(key, value.eq);
    }
  }

  // Add sorting if specified
  if (sortColumn && sortOrder) {
    query = query.order(sortColumn, { ascending: sortOrder === "asc" });
  }

  return query;
}
