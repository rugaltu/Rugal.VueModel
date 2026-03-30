
//import { ApiStore } from '../VueModel/src/testVueModel';
import { Queryer, Model, PathType, QueryNode } from 'vuemodel3';

Model.WithQueryDomName('pv-name');
Model.AddV_FilePicker('Root', {
    Store: 'test',
    ConvertType: 'buffer',
    OnSuccess: (files) => {
    },
})

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

Model.UpdateStore('Root', { aa: 'text' });
Model.AddV_Tree('Root', {
    ':SelfA': {
        'v-if': '.',
        'v-text': '.',
        'store': 'test self v-if v-text',
    },
    ':SelfB': {
        'v-model': '.',
        'v-show': '.',
        'store': 'test self v-model',
    },
    ':SelfC': {
        'v-for': '.',
        'store': [1, 2, 3],
        'watch': {
            CallBack: (newValue, oldValue) => {
                console.log('watch trigger SelfC changed');
            },
            Option: {
                deep: true,
            },
        },
        ':items': {
            'v-text': 'item',
        },
    },
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