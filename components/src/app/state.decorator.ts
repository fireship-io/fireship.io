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
