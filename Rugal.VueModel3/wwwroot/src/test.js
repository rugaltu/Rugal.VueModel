//import { ApiStore } from '../VueModel/src/testVueModel';
import { Model } from 'vuemodel3';
Model.WithQueryDomName('pv-name');
Model.AddV_Tree('testFor', {
    ':test': {
        // 'v-on:click': () => {
        // },
        // using: () => {
        //     debugger;
        // },
        'tag:button': {
            'v-on:click($el)': (el) => {
            },
        },
    },
}, {
    UseDeepQuery: true,
});
Model.Init();
//# sourceMappingURL=test.js.map