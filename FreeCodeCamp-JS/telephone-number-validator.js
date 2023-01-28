function telephoneCheck(str) {
  str = str.replace(/[^0-9()\- ]/g, "");
  let len = str.length;
  console.log(str);

  if (str[0] == "(" && str[4] == ")") {
    console.log("lol1");
    if (str[5] == " " && str[9] == "-") {
      console.log("three");
      return true;
    } else if (Number.isInteger(parseInt(str[5])) && str[8] == "-") {
      console.log("four");
      return true;
    }
  } else if (str[0] == 1) {
    console.log("lol3");
    if (str[1] === str[5] && str[5] === str[9] && str[9] === " ") {
      console.log("one");
      return true;
    } else if (str[5] === str[9] && str[9] === "-") {
      console.log("two");
      return true;
    } else if (str[2] === "(" && str[6] === ")" && str[11] === "-") {
      console.log("68");
      return true;
    } else if (str[1] === "(" && str[5] === ")" && str[9] === "-") {
      console.log("70");
      return true;
    }
  } else if (len === 12) {
    if (str[3] === str[7] && (str[3] === " " || str[3] === "-")) {
      console.log("five");
      return true;
    }
  } else if (len === 10) {
    if (Number.isInteger(parseInt(str))) {
      console.log("69");
      return true;
    }
  }
  return false;
}

telephoneCheck("2(757)622-7382");
