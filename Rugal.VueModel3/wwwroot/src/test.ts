
//import { ApiStore } from '../VueModel/src/testVueModel';
import { Queryer, Model, PathType, QueryNode } from 'vuemodel3';

Model.WithQueryDomName('pv-name');

Model.UpdateStore('bbb', '123');
Model.UpdateStore('ccc', '456');

let Root = Queryer.Query('B')[0];
Model.AddV_Tree(Root, {
    ':C': (Paths, Nodes) => {
        Model.AddV_Text(Nodes, 'ccc');
    },
})

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

Model.Init();