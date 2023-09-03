import { App } from "./app";
import { Bike } from "./bike";
import { Rent } from "./rent";
import { User } from "./user";

const bike = new Bike("mountain bike", "mountain", 123, 500, 100.50, "desc", 5, []);
const user = new User("Maria", "maria@mail.com", "1234");
const today = new Date;
const twoDaysFromToday = new Date();
twoDaysFromToday.setDate(twoDaysFromToday.getDate() + 2);
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const sevenDaysFromToday = new Date();
sevenDaysFromToday.setDate(sevenDaysFromToday.getDate() + 7);
const rent1 = Rent.create([], bike, user, today, twoDaysFromToday);
const rent2 = Rent.create([rent1], bike, user, tomorrow, sevenDaysFromToday);

const app = new App();
app.registerUser(user);
console.log(app.users);
