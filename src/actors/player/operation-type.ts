export enum OperationType {
    PLACE_THING = 'place',
    NOOP = 'noop',
  }
  
//   function mapEnumToList(eu: { [key in string]: string }) {
//     const arr: ListItem[] = []
//     Object.keys(eu).forEach(item => {
//       arr.push({ label: eu[item], value: item })
//     })
//     return arr
//   }
  
// 这个方法也是可以拿到 OperationType 的类型。
//export type OperationTextType = keyof typeof OperationType 
