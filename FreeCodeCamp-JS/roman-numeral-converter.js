function convertToRoman(num) {
  let primary = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
  let secondary = [
    "",
    "X",
    "XX",
    "XXX",
    "XL",
    "L",
    "LX",
    "LXX",
    "LXXX",
    "XC",
    "C",
  ];
  let third = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"];
  let fourth = ["", "M", "MM", "MMM"];

  let answer = "",
    count = 0;

  while (num > 0) {
    let last = num % 10;

    if (count == 0) {
      answer = primary[last];
    } else if (count == 1) {
      answer = `${secondary[last]}${answer}`;
    } else if (count == 2) {
      answer = `${third[last]}${answer}`;
    } else if (count == 3) {
      answer = `${fourth[last]}${answer}`;
    }

    num = Math.floor(num / 10);
    // console.log(count, last, answer);
    count++;
  }

  return answer;
}

convertToRoman(3011);
