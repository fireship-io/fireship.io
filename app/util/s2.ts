export default (()=>{
    const c = [120, 105, 88, 70, 84, 116, 69, 85, 90]; 
    return [1, 3, 4, 6, 0, 5, 7].map(i => String.fromCharCode(c[i])).join('');
})();