
//import { ApiStore } from '../VueModel/src/testVueModel';
import { Queryer, Model, PathType, QueryNode } from 'vuemodel3';
import { ref } from 'vue';

Model.WithQueryDomName('pv-name');

Model.AddV_Tree('testFor', {
    'func:/aaa': (a: number, b: number) => {
        return a + b;
    },
    'v-on:click': () => {
        const s = Model.Func('aaa', ...[1, 2]);
        debugger;
    },
});


Model.Init();