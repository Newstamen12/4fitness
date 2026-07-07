export function convertGradeToNumeric(grade) {
  if (!grade) return 0;
  let str = String(grade).trim().toLowerCase();
  
  if (str.includes('/')) {
    const parts = str.split('/');
    if (parts.length === 2) {
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (!isNaN(num) && !isNaN(den) && den > 0) {
        return Math.min(100, Math.round((num / den) * 100));
      }
    }
  }
  
  if (str.endsWith('%')) {
    const val = parseFloat(str);
    if (!isNaN(val)) return Math.min(100, Math.max(0, val));
  }
  
  const parsedNum = parseFloat(str);
  if (!isNaN(parsedNum)) {
    if (parsedNum <= 10 && parsedNum >= 0) {
      return Math.round(parsedNum * 10);
    }
    return Math.min(100, Math.max(0, Math.round(parsedNum)));
  }

  const letterMap = {
    'a+': 98, 'a': 95, 'a-': 90,
    'b+': 88, 'b': 85, 'b-': 80,
    'c+': 78, 'c': 75, 'c-': 70,
    'd+': 68, 'd': 65, 'd-': 60,
    'f': 50
  };
  
  for (const letter in letterMap) {
    if (str.startsWith(letter)) {
      return letterMap[letter];
    }
  }
  
  if (str.includes('elite') || str.includes('excellent') || str.includes('outstanding') || str.includes('perfect')) {
    return 95;
  }
  if (str.includes('very good') || str.includes('strong') || str.includes('great') || str.includes('good')) {
    return 85;
  }
  if (str.includes('average') || str.includes('satisfactory') || str.includes('decent') || str.includes('fair') || str.includes('medium')) {
    return 70;
  }
  if (str.includes('poor') || str.includes('weak') || str.includes('subpar') || str.includes('bad')) {
    return 55;
  }
  if (str.includes('fail') || str.includes('unsatisfactory') || str.includes('terrible')) {
    return 40;
  }

  return 50;
}

export function convertNumericToGrade(val) {
  if (val >= 90) return 'A';
  if (val >= 80) return 'B';
  if (val >= 70) return 'C';
  if (val >= 60) return 'D';
  return 'F';
}
