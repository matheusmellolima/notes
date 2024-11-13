import Invoice from "../src/statement/Invoice";
import { Performance } from "../src/statement/Performance";
import Play from "../src/statement/Play";
import statement from "../src/statement/Statement";

test("Statement", () => {
  const invoice = new Invoice("BigCo", [
    new Performance("hamlet", 55),
    new Performance("as-like", 35),
    new Performance("othello", 40),
  ]);
  const plays = [
    new Play("hamlet", "tragedy"),
    new Play("as-like", "comedy"),
    new Play("othello", "tragedy"),
  ];

  const result = statement(invoice, plays);
  expect(result).toBe(
    "Statement for BigCo\n" +
      "  hamlet: $650.00 (55 seats)\n" +
      "  as-like: $580.00 (35 seats)\n" +
      "  othello: $500.00 (40 seats)\n" +
      "Amount owed is $1,730.00\n" +
      "You earned 47 credits\n"
  );
});
