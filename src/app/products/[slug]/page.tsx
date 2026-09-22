import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, publishedProducts } from "@/content/products";
import { relatedProducts } from "@/content/relatedProducts";
import { productSchema } from "@/content/schema";
import { pageMetadata } from "@/lib/seo";
import { DishHero } from "@/components/dish/DishHero";
import { DishReading } from "@/components/dish/DishReading";
import { DishViews } from "@/components/dish/DishViews";
import { RelatedDishes } from "@/components/dish/RelatedDishes";
import { JsonLd } from "@/components/seo/JsonLd";

/**
 * One dish.
 *
 *   the photograph      100dvh, and almost no words on it
 *   the reading         the name, the statement, four details, two paragraphs
 *   the close views     0 or 1 full-bleed bands, openable
 *   the rest of the menu two bands at 56dvh
 *
 * What it does not have is as deliberate as what it does. No price, no portion
 * size, no allergen line, no calorie count, no "add to order", no availability
 * state, no rating and no sourcing claim — none of that exists in the content
 * model and none of it may be added. A demo restaurant that casually invents an
 * allergen label is making a mistake with a medical consequence, not a
 * presentation one.
 */
export function generateStaticParams() {
  return publishedProducts.map((dish) => ({ slug: dish.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dish = products.find((d) => d.slug === slug);
  if (!dish) return {};

  return pageMetadata({
    title: dish.seo?.title ?? dish.name,
    /**
     * Statement *and* description, not one or the other. Either alone is about
     * fifty characters — a search snippet is truncated at roughly a hundred and
     * sixty — and both sentences together are what the kitchen already says
     * about the dish. Nothing is composed that the copy deck does not contain.
     */
    description:
      dish.seo?.description ?? [dish.statement, dish.description].filter(Boolean).join(" "),
    path: `/products/${dish.slug}/`,
  });
}

export default async function DishPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dish = publishedProducts.find((d) => d.slug === slug);
  if (!dish) notFound();

  const related = relatedProducts(dish, publishedProducts);

  return (
    <>
      <DishHero dish={dish} />
      <DishReading dish={dish} />
      <DishViews dish={dish} />
      <RelatedDishes dishes={related} />

      {/* Menu-item structured data. Deliberately carries no `offers` and no
          `suitableForDiet` — see src/content/schema.ts for the full list of what
          is left out and why. */}
      <JsonLd data={productSchema(dish)} />
    </>
  );
}
