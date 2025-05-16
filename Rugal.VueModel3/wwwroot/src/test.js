//import { ApiStore } from '../VueModel/src/testVueModel';
import { Model } from 'vuemodel3';
Model.WithQueryDomName('pv-name')
    .UpdateStore('C', 'aaa')
    .UpdateStore('Test.A', null)
    .AddV_Watch('Test.A', (Value) => {
    alert('a');
}, true)
    .AddV_Watch('Test.A', (Value) => {
    alert('b');
})
    .AddV_Tree('Root', {
    ':B': {
        'v-else': null,
    },
    ':C': {
        'v-else-if': 'A == 1',
    }
}, {
    UseTreePath: false,
})
    .Init();
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