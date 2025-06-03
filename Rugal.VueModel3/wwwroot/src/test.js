//import { ApiStore } from '../VueModel/src/testVueModel';
import { Model } from 'vuemodel3';
Model.WithQueryDomName('pv-name');
let s = (a) => { };
let ss = s.prototype;
Model
    .AddV_Tree('Root', {
    'v-for(item, index)': 'Datas',
    'v-for': '(item, index) in Datas',
    'v-on:click(item, index)': (item, index) => {
    },
    ':Btn': Paths => {
        Model.AddV_FilePicker(Paths, {
            Store: 'a',
            ConvertType: 'base64',
        });
    },
    //{
    //    'using': (Paths) => {
    //        Model.AddV_FilePicker(Paths, {
    //            Store: 'a',
    //            ConvertType: 'base64',
    //        });
    //    }
    //}
}, {
    UseTreePath: false,
})
    .UpdateStore('C', 'aaa')
    .UpdateStore('Test.A', null)
    .AddV_Watch('Test.A', (Value) => {
    alert('a');
}, true)
    .AddV_Watch('Test.A', (Value) => {
    alert('b');
})
    .UpdateStore('Datas', [{ a: 'a' }, { b: 'b' }])
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