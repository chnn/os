import dynamic from "next/dynamic";

import { Plan } from "../util/plan";
import { Amount } from "./Amount";
import { Table } from "./Table";

import type { LocalStorageCheckboxProps } from "./LocalStorageCheckbox";

type ShoppingListItem = {
  key: string;
  name: string;
  quantity: number | null;
  units: string | null;
  comment: string;
};

type ShoppingList = ShoppingListItem[];

function getShoppingList(plan: Plan): ShoppingList {
  const byKey: { [key: string]: ShoppingListItem } = {};

  for (const { recipes: recipeIds, servings } of Object.values(plan.meals)) {
    const recipes = recipeIds.map((id) => plan.recipes[id]);

    for (const { ingredients: ingredientIds } of recipes) {
      const ingredients = ingredientIds.map((id) => plan.ingredients[id]);

      for (const {
        quantity,
        units,
        name,
        comment,
        nonShopping,
      } of ingredients) {
        if (nonShopping) {
          continue;
        }

        const key = `${quantity} ${units} ${name}, ${comment}`;
        const item = byKey[key];

        if (!item) {
          byKey[key] = {
            key,
            quantity: quantity ? quantity * servings : null,
            units,
            name,
            comment,
          };
        } else if (quantity) {
          item.quantity = (item.quantity || 0) + quantity * servings;
        }
      }
    }
  }

  return Object.values(byKey).reduce<ShoppingList>(
    (acc, { key, name, quantity, comment, units }) => [
      ...acc,
      {
        key,
        name,
        quantity,
        comment,
        units,
      },
    ],
    []
  );
}

const LocalStorageCheckbox = dynamic<LocalStorageCheckboxProps>(
  () => import("./LocalStorageCheckbox").then((m) => m.LocalStorageCheckbox),
  { ssr: false }
);

export function ShoppingList({ plan }: { plan: Plan }) {
  const shoppingList = getShoppingList(plan);

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Th className="w-9" />
          <Table.Th className="w-28 text-right">Quantity</Table.Th>
          <Table.Th>Item</Table.Th>
          <Table.Th>Comment</Table.Th>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {shoppingList.map((item, i) => {
          return (
            <Table.Row key={item.key}>
              <Table.Td>
                <LocalStorageCheckbox itemKey={item.key} />
              </Table.Td>
              <Table.Td className="text-right">
                <Amount quantity={item.quantity} units={item.units} />
              </Table.Td>
              <Table.Td>{item.name}</Table.Td>
              <Table.Td>{item.comment}</Table.Td>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}