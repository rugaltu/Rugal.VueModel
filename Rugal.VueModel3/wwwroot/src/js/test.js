System.register(["../../VueModel/src/VueModel"], function (exports_1, context_1) {
    "use strict";
    var VueModel_1;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (VueModel_1_1) {
                VueModel_1 = VueModel_1_1;
            }
        ],
        execute: function () {
            VueModel_1.Model
                .WithQueryAttribute('pv-name')
                .WithMountId('app')
                .Init();
        }
    };
});
//# sourceMappingURL=test.js.map