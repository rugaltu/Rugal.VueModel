
let A = 123;
let Data = {
    TestA: {
        TestB: {
            TestC: {

            }
        }
    }
};


const GetTestUrl = 'api/Test/GetTest'; // 新增-銀行帳號

Model
    .AddApi({
        GetTest: {
            Url: GetTestUrl,
            Method: 'GET',
        },
    })
    .AddProperty('A1.A2.A3.TestValue', {
        Value: 123,
        Bind: ['B1.Value', 'C1']
    })
    .AddV_Text('Test', 'C1')
    .Init();

