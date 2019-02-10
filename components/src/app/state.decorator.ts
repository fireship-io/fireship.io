import { ChangeDetectorRef } from '@angular/core';

// Use to write methods that trigger change detection after execution
export function SetState() {
  return function(target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function(this: Function, ...args) {
      const result = originalMethod.call(this, ...args);
      try {
        const cd: ChangeDetectorRef = (this as any).cd;
        cd.detectChanges();
      } catch (err) {
        console.error(
          'Change Detector Error. Do not set state in a constructor',
          err
        );
      }

      return result;
    };

    return descriptor;
  };
}


// export function State() {
//   return function(target: Object, key: string | symbol) {

//     let val = target[key];

//     const getter = () =>  {
//         return val;
//     };
//     const setter = (next) => {
//         console.log('@state', this, target);
//         val = next;
//         try {
//           const cd: ChangeDetectorRef = (target as any).cd;
//           cd.detectChanges();
//         } catch (err) {
//           console.error(
//             '@state decorator Error. Is cd a dependency? Did you set state in a constructor?',
//             err
//           );
//         }
//     };

//     Object.defineProperty(target, key, {
//       get: getter,
//       set: setter,
//       enumerable: true,
//       configurable: true,
//     });

//   };
// }

