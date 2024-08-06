
let A = 111;
let Data = {
    TestA: {
        TestB: {
            TestC: {

            }
        }
    }
};


const GetTestUrl = 'api/Test/GetTest'; // 新增-銀行帳號


let TestDom = new DomEditor();
let GetRoot = TestDom
    .WithRootFrom(Item => Item.WithAttr('vc-col', 'TestA'));




//Model
//    .AddProperty('Test.Value', {
//        Value: 333,
//        get() {
//            return A;
//        },
//        set(Value) {
//            A = Value;
//        }
//    })
//.Init();

