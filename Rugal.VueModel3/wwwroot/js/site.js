

const { createApp } = Vue;


const Data = {
    GetTest: {
        value: null,
    },
    GetTest2: {
        value: null,
    },
    GetTest3: {
        value: null,
    }
};

const Page = createApp({
    async created() {
        await this.ApiGetTest();
    },
    data() {
        return Data;
    },
    methods: {
        async ApiGetTest() {
            let ApiRet = await fetch('/api/Test/GetTest')
                .then(ApiRet => ApiRet.json());

            //.then(ApiRet => {
            //    Data.GetTest2 = ApiRet;
            //    this.$forceUpdate();
            //});

            Data.GetTest2 = ApiRet;
            this.$forceUpdate();
        },
        TestClick() {
            console.log('Vue Click');
            Data.GetTest2.value += 'B';
            this.$forceUpdate();
        }
    }
}).mount('#App');


