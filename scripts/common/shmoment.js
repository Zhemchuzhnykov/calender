const getMethodsNames = {
  years: 'getFullYear',
  months: 'getMonth',
  days: 'getDate',
  hours: 'getHours',
  minutes: 'getMinutes',
  seconds: 'getSeconds',
  milliseconds: 'getMilliseconds',
};

const setMethodsNames = {
  years: 'setFullYear',
  months: 'setMonth',
  days: 'setDate',
  hours: 'setHours',
  minutes: 'setMinutes',
  seconds: 'setSeconds',
  milliseconds: 'setMilliseconds',
};

// the function helps subtract or add a certain period of time to a passed time
export const shmoment = (date) => {
  let result = new Date(date);

  const calculator = {
    add(units, value) {
      const currentUnitValue = result[getMethodsNames[units]]();
      result = new Date(
        result[setMethodsNames[units]](currentUnitValue + value)
      );
      return this;
    },
    subtract(units, value) {
      return this.add(units, -value);
    },
    result() {
      return result;
    },
  };

  return calculator;
};