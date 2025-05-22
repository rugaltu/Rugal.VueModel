
//import { ApiStore } from '../VueModel/src/testVueModel';
import { Queryer, Model } from 'vuemodel3';

Model.WithQueryDomName('pv-name');

let s = (a: any) => { };
let ss = s.prototype;

Model
    .AddV_Tree('Root', {
        'v-for(item, index)': 'Datas',
        'v-for': '(item, index) in Datas',
        'v-on:click(item, index)': (item: any, index: any) => {
            debugger;
        }
    }, {
        UseTreePath: false,
    })
    .UpdateStore('C', 'aaa')
    .UpdateStore('Test.A', null)
    .AddV_Watch('Test.A', (Value: any) => {
        alert('a');
    }, true)
    .AddV_Watch('Test.A', (Value: any) => {
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
