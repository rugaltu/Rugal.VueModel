
//import { ApiStore } from '../VueModel/src/testVueModel';
import { Queryer, Model, PathType, QueryNode } from 'vuemodel3';
import { ref } from 'vue';

Model.WithQueryDomName('pv-name');

Model.AddV_Tree('testFor', {
    ':test': {
        // 'v-on:click': () => {

        // },
        // using: () => {
        //     debugger;
        // },
        'tag:button': {
            'v-on:click($el)': (el: any) => {
               
            },
        },
    },
}, {
    UseDeepQuery: true,
});

Model.Init();