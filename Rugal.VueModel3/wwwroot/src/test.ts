
//import { ApiStore } from '../VueModel/src/testVueModel';
import { Queryer, Model, PathType } from 'vuemodel3';

Model.WithQueryDomName('pv-name');

//let s = Queryer.QueryCss('[class="MyTest"]', {
//    Mode: 'DeepMulti'
//});



let P1: PathType = ['A1', 'B2'];
let P2: PathType = 'C3';
let P3 = [P1, P2];

let ss = {};
Model.AddV_PropertyFrom(ss, 'aaa.bbb', {
    Target: 'Datas',
});
(window as any).ss = ss;

Model
    .UpdateStore('test', [{ value: 1 }, { value: 2 }])
    .AddV_Tree('Root', {
        'v-for(item, index)': 'Datas',
        'v-for': '(item, index) in Datas',
        'v-on:click(item, index)': (item: any, index: any) => {
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
    .AddV_Watch('Test.A', (Value: any) => {
        alert('a');
    })
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
