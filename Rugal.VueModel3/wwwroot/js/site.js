

//const { createApp } = Vue;


//const Data = {
//    GetTest: {
//        value: null,
//    },
//    GetTest2: {
//        value: null,
//    },
//    GetTest3: {
//        value: null,
//    }
//};

//const Page = createApp({
//    async created() {
//        await this.ApiGetTest();
//    },
//    data() {
//        return Data;
//    },
//    methods: {
//        async ApiGetTest() {
//            let ApiRet = await fetch('/api/Test/GetTest')
//                .then(ApiRet => ApiRet.json());

//            //.then(ApiRet => {
//            //    Data.GetTest2 = ApiRet;
//            //    this.$forceUpdate();
//            //});

//            Data.GetTest2 = ApiRet;
//            this.$forceUpdate();
//        },
//        TestClick() {
//            console.log('Vue Click');
//            Data.GetTest2.value += 'B';
//            this.$forceUpdate();
//        }
//    }
//}).mount('#App');


//Vc.AddVc_Config({
//    Api: {
//        GetColumns: {
//            Type: 'GET',
//            Bind: {
//                Chk1: 'm:checkbox; mul:true; f:Detail.SelectColumns',
//                Chk2: 'm:checkbox; mul:true; f:Detail.SelectColumns',
//            }
//        },
//        Datas: {
//            Type: 'GET',
//            Bind: {
//                MySelect: 'm:select; f:Datas; to:SelectResult; dis:Name; val:Id; def:0; opt:MyOption;',
//                MyCheckbox: 'm:for-checkbox; f:Datas; To:Default.ChkResult; val:Id; dis:Name; of:MyDiv; lbl:MySpan',
//            }
//        }
//    },
//    Bind: {
//        Etc: {
//            IsSelect: 'm:checkbox; chk:true',
//        },
//    }
//}).Init();

Model
    .UpdateStore([
        {
            Id: 1,
            Name: 'A'
        },
        {
            Id: 2,
            Name: 'B',
        }
    ], 'Datas')
    .AddVcol_Click('AAA', () => {

    })
    .UpdateStore(['Chk1'], 'Detail.SelectColumns')
//.Init();