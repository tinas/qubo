import { createQubo } from "../lib";

interface Fruit {
  id: number;
  name: string;
  qty: number;
}

const data: Fruit[] = [
  { id: 1, name: "Apple", qty: 5 },
  { id: 2, name: "Banana", qty: 10 },
  { id: 3, name: "Orange", qty: 20 },
];

const qubo = createQubo<Fruit>(data);

console.log('find: ', qubo.find({ qty: { $gt: 5 } }) );

console.log('findOne: ', qubo.findOne({ qty: { $gt: 5 } }) );

console.log('evaluate: ', qubo.evaluate({ qty: { $gt: 5 } }) );

console.log('evaluateOne: ', qubo.evaluateOne(
  { id: 99, name: "Test", qty: 50 }, 
  { qty: { $gt: 60 } }
));
