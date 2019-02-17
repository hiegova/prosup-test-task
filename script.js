// масив об'єктів
const data = [
  { fullName: { surname: "xxx", firstName: "yyy", middleName: "zzz" } },
  { fullName: { surname: "XXX", firstName: "YYY", middleName: "ZZZ" } }
];

// правило перетворень
const rules = {
  fullName: { surname: true, firstName: true, middleName: false }
};

// локалізації
const locals = {
  "fullName.surname": "Прізвище",
  "fullName.middleName": "По-батькові"
};

// результат
const result = [
  { name: "Прізвище", value1: "xxx", value2: "XXX", value3: "xxX" },
  { name: "firstName", value1: "yyy", value2: "YYY", value3: "yyY" }
];

console.log(convert(data, rules, locals));

function convert(data, rules, locals) {
  return localize(converter(data, rules), locals);
}

function converter(data, rules) {
  const tempHashObj = {};

  data.forEach((obj, inx) => objTravers(obj, inx, rules));

  function objTravers(obj, index, rules, path = "") {
    for (let prop in obj) {
      let propValue = obj[prop];

      if (typeof propValue === "object" && !(propValue instanceof Date)) {
        path += prop + ".";
        objTravers(propValue, index, rules[prop], path);
        path = "";
      } else if (rules[prop] === true) {
        const name = path + prop || prop;

        if (!tempHashObj.hasOwnProperty(name)) {
          tempHashObj[name] = {};
        }

        if (isDate(propValue)) {
          propValue = dateFormat(propValue);
        }

        tempHashObj[name].name = name;
        tempHashObj[name]["value" + (index + 1)] = propValue;
      }
    }
  }

  return Object.values(tempHashObj);
}

function localize(arrResult, locals) {
  arrResult.forEach(obj => {
    const fullPath = obj.name;
    const local = locals[fullPath];

    if (local) {
      obj.name = local;
    } else {
      const nameArr = fullPath.split(".");
      obj.name = nameArr[nameArr.length - 1];
    }
  });

  return arrResult;
}

function isDate(value) {
  return value instanceof Date ? true : false;
}

function dateFormat(date) {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric"
  };
  return new Intl.DateTimeFormat("ua", options).format(date);
}
