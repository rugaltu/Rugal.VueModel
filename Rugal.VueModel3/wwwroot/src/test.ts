
//import { ApiStore } from '../VueModel/src/testVueModel';
import { Queryer, Model, PathType, QueryNode } from 'vuemodel3';

Model.WithQueryDomName('pv-name');

//Model.UpdateStore('bbb', '123');
//Model.UpdateStore('ccc', '456');
//let Root = Queryer.Query('B')[0];
//let A = {
//    B: {
//        C: 1,
//    }
//};
//Model.UpdateStore('Test', A);
//Model.UpdateStore('Test', {
//    B: {
//        D: 2,
//    }
//});
//console.log(A);

Model.AddApi({
    Search: {
        Method: 'GET',
        Url: 'api/Test/GetTest',
    }
})
Model.AddSubApi('Search', {
    PropertyName: 'IsCalling',
    NotifyEvent: (Args) => {
        console.log(Args.PropertyName, Args.Value);
    },
});

Model.ApiCall('Search');
Model.UpdateStore('test', { test: 123 });
Model.UpdateStore('sources', [{ test: 123 }, { test: 456 }]);

Model.AddV_Tree('Root', {
    //':For': {
    //}
    //'v-text(item)': (item: any) => item.test,
});


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