const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const getSubscription = async (subscriptionId) => {
  try {
    const subscription = subscriptionId
      ? await stripe.subscriptions.retrieve(subscriptionId)
      : null;

    // if the subscription has a product, get the product info also
    if (subscription?.plan?.product) {
      subscription.product = await getProduct(subscription.plan.product);
    }

    return subscription;
  } catch (error) {
    console.error("Error fetching subscription:", error);
    throw new Error("Failed to retrieve subscription");
  }
};

export const getCustomer = async (customerId) => {
  try {
    return await stripe.customers.retrieve(customerId);
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw new Error("Failed to retrieve customer");
  }
};

export const createCustomer = async (user, isPartner) => {
  const { email } = user;
  const name = isPartner
    ? user.partner.company_legal_name
    : user.family.family_name;
  const metadata = {
    [isPartner ? "partner_id" : "family_id"]: isPartner
      ? user.partner.id
      : user.family.id,
  };

  try {
    return await stripe.customers.create({
      email,
      name,
      metadata,
    });
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    throw new Error(
      "Sorry, there was a problem setting up your billing. Please try again or contact us for assistance."
    );
  }
};

export const getCustomerSubscriptions = async (customerId, showAll = false) => {
  try {
    if (!customerId) {
      return []; // Return an empty list if there's no customerId
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
    });

    // hide canceled subscriptions unless the showAll flag is true
    if (!showAll) {
      subscriptions.data = subscriptions.data.filter(
        (subscription) => subscription.status !== "canceled"
      );
    }

    //   get the product info for each subscription, if it exists
    await Promise.all(
      subscriptions.data.map(async (subscription) => {
        if (subscription?.plan?.product) {
          subscription.product = await getProduct(subscription.plan.product);
        }
      })
    );

    return subscriptions?.data || []; // If subscriptions.data is undefined, return an empty list
  } catch (error) {
    console.error("Error fetching customer subscriptions:", error);
    throw new Error(
      "Sorry, there was a problem fetching your subscriptions. Please try again or contact us for assistance."
    );
  }
};

export const getProduct = async (productId) => {
  try {
    return await stripe.products.retrieve(productId);
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to retrieve product");
  }
};

export const getPortalSessionUrl = async (customerId) => {
  try {
    const session = customerId
      ? await stripe.billingPortal.sessions.create({
          customer: customerId,
          return_url: "https://www.totalfamily.io/settings/billing",
        })
      : null;

    return session?.url;
  } catch (error) {
    console.error("Error creating portal session:", error);
    throw new Error("Failed to create billing portal session");
  }
};

export const createFirstYearCheckoutSession = async (customerId) => {
  try {
    return await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: "price_1OiX5wJQkp97oit7WcqHPDZd",
          quantity: 1,
        },
        {
          price: "price_1OiX4EJQkp97oit7YJotELIs",
          quantity: 1,
        },
      ],
      customer: customerId,
      success_url: `https://www.totalfamily.io/settings/billing`,
      cancel_url: `https://www.totalfamily.io/settings/billing`,
    });
  } catch (error) {
    console.error("Error creating first year checkout session:", error);
    throw new Error(
      "Sorry, there was a problem creating your checkout session. Please try again or contact us for assistance."
    );
  }
};

export const getConnectedAccount = async (accountId) => {
  try {
    return await stripe.accounts.retrieve(accountId);
  } catch (error) {
    console.error("Error fetching connected account:", error);
    throw new Error("Failed to retrieve connected account");
  }
};

export const createConnectedAccount = async (user) => {
  try {
    const account = await stripe.accounts.create({
      type: "express",
      country: "US",
      email: user.email,
      capabilities: {
        card_payments: { requested: false },
        transfers: { requested: true },
      },
      business_profile: {
        product_description: "Coaching services",
        url: "https://www.totalfamily.io",
      },
      metadata: {
        coach_id: user.profile.id,
        user_id: user.id,
        first_name: user.profile.first_name,
        last_name: user.profile.last_name,
      },
    });

    return account;
  } catch (error) {
    console.error("Error creating connected account:", error);
    throw new Error(
      "Sorry, there was a problem setting up your billing. Please try again or contact us for assistance."
    );
  }
};

export const getConnectAccountLink = async (accountId, onboarding = true) => {
  try {
    if (onboarding) {
      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: "https://www.totalfamily.io/settings/payments",
        return_url: "https://www.totalfamily.io/settings/payments",
        type: "account_onboarding",
      });

      return accountLink;
    } else {
      const accountLink = await stripe.accounts.createLoginLink(accountId);

      return accountLink;
    }
  } catch (error) {
    console.error("Error creating account link:", error);
    throw new Error("Failed to create account link");
  }
};

export const getConnectedAccountDetails = async (id) => {
  // retreive the current balance, and recent transfers
  try {
    const account = await getConnectedAccount(id);

    const balance = await stripe.balance.retrieve({
      stripeAccount: id,
    });

    const transfers = await stripe.transfers.list({
      destination: id,
    });

    const payouts = await stripe.payouts.list({
      stripeAccount: id,
    });

    return {
      account,
      balance,
      recent_activity: [...transfers.data, ...payouts.data],
    };
  } catch (error) {
    console.error("Error fetching connected account details:", error);
    throw new Error("Failed to retrieve connected account details");
  }
};

export const getBalance = async () => {
  try {
    return await stripe.balance.retrieve();
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw new Error("Failed to retrieve balance");
  }
};
