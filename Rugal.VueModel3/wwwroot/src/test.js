//import { ApiStore } from '../VueModel/src/testVueModel';
import { Model } from 'vuemodel3';
Model.WithQueryDomName('pv-name');
Model.AddV_Tree('testFor', {
    'func:/aaa': (a, b) => {
        return a + b;
    },
    'v-on:click': () => {
        const s = Model.Func('aaa', ...[1, 2]);
        debugger;
    },
});
Model.Init();
//# sourceMappingURL=test.js.map