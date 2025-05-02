//import { ApiStore } from '../VueModel/src/testVueModel';
import { Queryer } from 'vuemodel3';
Queryer.WithDomName('pv-name')
    .Init();
let B = Queryer.Query(['Root', 'B']);
let C = Queryer.Query(['Root', 'C']);
console.log(B);
console.log(C);
//Model
//    .WithQueryAttribute('pv-name')
//    //.AddV_FilePicker('BtnPicker', {
//    //    StorePath: 'Images',
//    //    Accept: 'image/*',
//    //    ConvertType: ['base64', 'buffer'],
//    //    Multiple: true,
//    //})
//    .WithMountId('app')
//    .Init();
//# sourceMappingURL=test.js.map