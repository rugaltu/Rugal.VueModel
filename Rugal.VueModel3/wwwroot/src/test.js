//import { ApiStore } from '../VueModel/src/testVueModel';
import { Model } from 'vuemodel3';
Model.WithQueryDomName('pv-name');
let P1 = ['A1', 'B2'];
let P2 = 'C3';
let P3 = [P1, P2];
let ss = {};
Model.AddV_PropertyFrom(ss, 'aaa.bbb', {
    Target: 'Datas',
});
window.ss = ss;
Model
    .UpdateStore('test', [{ value: 1 }, { value: 2 }])
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
    //'v-on-mounted:item': (item: any) => {
    //    debugger;
    //},
    //'v-on-unmounted:item': (item: any) => {
    //    debugger;
    //}
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
    //.AddV_OnMounted('Root', (props: any) => {
    //})
    //.AddV_OnUnMounted('Root', (props: any) => {
    //})
    .UpdateStore('C', 'aaa')
    .UpdateStore('Test.A', null)
    .AddV_Watch('Test.A', (Value) => {
    alert('a');
})
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