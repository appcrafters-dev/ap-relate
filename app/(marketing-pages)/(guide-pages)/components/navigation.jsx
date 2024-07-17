import { useState } from "react";
import { classNames } from "lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon, ListBulletIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/buttons";
import NewGuidePageForm from "./new-guide-page-form";
import Badge from "@/components/ui/badge";
import GuideSearch from "./search";

export function GuideNavigation({
  className = null,
  onLinkClick = null,
  articles,
  categories,
  hideSearch = false,
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin/guide");
  const [editNav, setEditNav] = useState(false);

  // const [openCategories, setOpenCategories] = useState({});

  // const toggleCategory = (category) => {
  //   setOpenCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  // };

  function generateNavigation(categories, parentId = null) {
    return categories
      .filter((category) => category.parent_id === parentId)
      .map((category) => {
        const subcategories = generateNavigation(categories, category.id);
        const links = articles
          .filter((article) => article.category_id === category.id)
          .map((article) => {
            const href = isAdmin
              ? `/admin/guide/articles/${article.id}`
              : `/guide/${article.slug_path}`;
            return {
              href,
              title: article.title,
              id: article.id,
              is_published: article.is_published,
              order: article.order,
              isActive: pathname === href,
            };
          });
        const href = isAdmin
          ? `/admin/guide/categories/${category.id}`
          : `/guide/${category.slug_path}`;
        return {
          ...category,
          href,
          subcategories,
          id: category.id,
          order: category.order,
          links,
          isOpen:
            editNav ||
            (pathname === "/guide" && parentId === null) ||
            pathname.includes(category.slug_path) ||
            links.some((link) => link.isActive) ||
            subcategories.some((subcategory) => subcategory.isOpen) ||
            (isAdmin &&
              (pathname.includes(`/articles/${category.id}`) ||
                pathname.includes(`/categories/${category.id}`))),
        };
      });
  }

  const navigation = generateNavigation(categories);

  function renderNavigation(navigation, level = 0) {
    return navigation
      .sort((a, b) => a.order - b.order)
      .map((section) => (
        <li key={section.id}>
          {section.subcategories.length > 0 || section.links.length > 0 ? (
            <Link
              href={
                isAdmin
                  ? `/admin/guide/categories/${section.id}`
                  : `/guide/${section.slug_path}`
              }
              className="flex w-full items-center justify-between text-left"
              //   onClick={() => toggleCategory(section.id)}
            >
              <h2
                className={classNames(
                  level === 0
                    ? "font-brand text-2xl text-gray-900"
                    : pathname === `/guide/${section.slug_path}` ||
                      section.isActive
                    ? "text-base font-semibold text-tfm-primary-500"
                    : "text-base text-gray-600 hover:text-tfm-primary",
                  "transition"
                )}
              >
                {section.title}
              </h2>

              <ChevronDownIcon
                className={classNames(
                  level === 0 ? "h-4 w-4" : "h-3 w-3 transition-transform",
                  section.isOpen ? "rotate-180 transform" : ""
                )}
              />
            </Link>
          ) : (
            <Link
              href={
                isAdmin
                  ? `/admin/guide/categories/${section.id}`
                  : `/guide/${section.slug_path}`
              }
              className={classNames(
                "block w-full text-base",
                pathname === `/guide/${section.slug_path}` || section.isActive
                  ? "font-semibold text-tfm-primary-500"
                  : "text-gray-600 hover:text-tfm-primary",
                "transition"
              )}
            >
              {section.title}
            </Link>
          )}
          {section.isOpen && (
            <ul
              role="list"
              className="ml-2 mt-2 space-y-2 border-l border-gray-100 pl-4 lg:mt-4 lg:space-y-4 lg:border-gray-200"
            >
              {renderNavigation(section.subcategories, level + 1)}
              {section.links.map((link) => (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    onClick={onLinkClick}
                    className={classNames(
                      "inline-flex w-full items-center justify-between text-base",
                      link.isActive
                        ? "font-semibold text-tfm-primary-500"
                        : "text-gray-600 hover:text-tfm-primary"
                    )}
                  >
                    {link.title}
                    {!link.is_published && <Badge color="yellow">Draft</Badge>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ));
  }

  return (
    <nav className={classNames("w-full text-base lg:text-sm", className)}>
      <ul role="list" className="space-y-4">
        {!hideSearch && (
          <li>
            {isAdmin ? (
              <Button
                onClick={() => setEditNav(!editNav)}
                Icon={ListBulletIcon}
                extraSmall
                fullWidth
                primary
              >
                {editNav ? "Save Changes" : "Edit Navigation"}
              </Button>
            ) : (
              <GuideSearch />
            )}
          </li>
        )}
        {renderNavigation(navigation)}
      </ul>
      {editNav && <NewGuidePageForm {...{ categories, articles }} />}
    </nav>
  );
}
