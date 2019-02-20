# test-task
### Тестове завдання на позицію Junior JavaScript developer



## Деталі реалізації

*converter(data, rules)*

Основна логіка перетворень, приймає початковий масив і об'єкт з правилами перетворень.
В ході її роботи створюється тимчасовий хеш-об'єкт, перевіряються поля на необхідність відповідно до правил, і форматуються поля типу Date
```javascript
function converter(data, rules) {
  const tempHashObj = {};

  data.forEach((obj, inx) => objTravers(obj, inx, rules));

  // рекурсивна функція для обходу всієї структури об'єкта data
  // приймає строковий параметр path для формування імен полів виду "parent.child"
  function objTravers(obj, index, rules, path = "") {
    for (let prop in obj) {
      let propValue = obj[prop];
      
      // якщо поле є об'єктом, виконується рекурсивний виклик objTravers зі збереженням шляху
      if (typeof propValue === "object" && !(propValue instanceof Date)) {
        path += prop + ".";
        objTravers(propValue, index, rules[prop], path);
        path = "";
        
      // перевірка на відповідність правилам перетворень
      } else if (rules[prop] === true) {
        const name = path + prop || prop;
        
        // якщо поля не існує, створити його
        if (!tempHashObj.hasOwnProperty(name)) {
          tempHashObj[name] = {};
        }
        
        // форматування дати
        if (isDate(propValue)) {
          propValue = dateFormat(propValue);
        }

        tempHashObj[name].name = name;
        tempHashObj[name]["value" + (index + 1)] = propValue;
      }
    }
  }

  // повернути результат у вигляді масиву
  return Object.values(tempHashObj);
}
```

*localize(arrResult, locals)*

приймає масив з даними та об'єкт з локалізованими заголовками замінює назви полів name відповідно до об'єкта local.
```javascript
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
```

Допоміжні функції для роботи з об'єктами Data
```javascript
// isDate повертає true якщо value є Datе-об'єктом
function isDate(value) {
  return value instanceof Date ? true : false;
}
// dateFormat повертає об'єкт Date в форматі DD.MM.YYYY
function dateFormat(date) {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric"
  };
  return new Intl.DateTimeFormat("ua", options).format(date);
}
```
При форматуванні великої кількості дат кращим варіантом буде створення об'єкта Intl.DateTimeFormat і використання функції, що надається його властивістю format.
