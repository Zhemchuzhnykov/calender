// export let storage = {
//   eventIdToDelete: null,
//   displayedWeekStart: null,
//   events: [
//     {
//       id: 0.7520027086457335,
//       title: "Celebrate Nastya's Birthday",
//       description: 'To have a good time',
//       start: new Date('2022-03-05T16:00:00.000Z'),
//       end: new Date('2022-03-05T19:00:00.000Z'),
//     },
//     {
//       id: 0.7520027086457337,
//       title: "Buy 8 March gifts",
//       description: "To buy gifts to congratulate Nastya and her mother on the Internations Women's Day",
//       start: new Date('2022-03-07T13:00:00.000Z'),
//       end: new Date('2022-03-07T17:00:00.000Z'),
//     },
//     {
//       id: 0.7520027086457339,
//       title: "Buy a gift for Nastya's monther's birthday",
//       description: "To buy a gift in order to give it to Nastya's mother on her birthday",
//       start: new Date('2022-03-17T14:00:00.000Z'),
//       end: new Date('2022-03-17T16:00:00.000Z'),
//     },
//   ],
// };

export const setItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  // storage[key] = value;
};

export const getItem = (key) => {
  return JSON.parse(localStorage.getItem(key));
  // return storage[key];
};