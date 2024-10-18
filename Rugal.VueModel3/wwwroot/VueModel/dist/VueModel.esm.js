//#endregion
//#region FuncBase
class FuncBase {
    //#region Protected Property
    $NavigateToFunc;
    $DefaultDateJoinChar;
    //#endregion
    constructor() {
        this.$NavigateToFunc = null;
        this.WithDateTextJoinChar('-');
    }
    //#region Public With Method
    WithNavigateTo(NavigateToFunc) {
        this.$NavigateToFunc = NavigateToFunc;
        return this;
    }
    WithDateTextJoinChar(JoinChar) {
        this.$DefaultDateJoinChar = JoinChar;
        return this;
    }
    //#endregion
    //#region Public Method
    GenerateId() {
        let NewId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
            let RandomValue = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
            let Id = char === 'x' ? RandomValue : (RandomValue & 0x3) | 0x8;
            return Id.toString(16);
        });
        return NewId;
    }
    GenerateIdReplace(FillString) {
        let Id = this.GenerateId().replaceAll('-', FillString);
        return Id;
    }
    NavigateTo(Url, UrlParam = null) {
        Url = this.Paths(Url);
        if (Url == null || Url.length == 0 || Url[0].length == 0)
            this.$Throw('Url can not be null or empty');
        Url = Url.map(Item => Item.replace(/\/+$/g, '').replace(/^\/+/g, '/'));
        let CombineUrl = this.ToJoin(Url, '/');
        if (UrlParam != null) {
            UrlParam = this.ConvertTo_UrlQuery(UrlParam);
            CombineUrl += `?${UrlParam}`;
        }
        if (this.$NavigateToFunc)
            this.$NavigateToFunc(CombineUrl);
        else
            window.location.href = CombineUrl;
        return this;
    }
    ForEachObject(Param, Func) {
        for (let Key of Object.getOwnPropertyNames(Param)) {
            if (Key.match(/^$/g))
                continue;
            let Value = Param[Key];
            if (Func != null)
                Func.call(this, Key, Value);
        }
    }
    DeepObjectExtend(Target, Source, MaxDepth = 10) {
        if (MaxDepth == 0)
            return {
                ...Target,
                ...Source,
            };
        let AllKeys = Object.keys(Source);
        for (let i = 0; i < AllKeys.length; i++) {
            let Key = AllKeys[i];
            if (!(Key in Target))
                Target[Key] = Source[Key];
            else if (typeof Source[Key] != "object")
                Target[Key] = Source[Key];
            else {
                let NewObject = {
                    ...this.DeepObjectExtend(Target[Key], Source[Key], MaxDepth - 1),
                };
                Target[Key] = NewObject;
            }
        }
        return Target;
    }
    ToDateInfo(QueryDate) {
        QueryDate ??= new Date();
        let Info = this.$CreateDateInfo(QueryDate);
        return Info;
    }
    ToDateText(QueryDate, Option) {
        QueryDate = this.$CreateDateInfo(QueryDate);
        Option ??= {};
        if (typeof Option == 'string')
            Option = { Format: Option };
        Option.DateJoinChar ??= this.$DefaultDateJoinChar;
        Option.Format ??= `yyyy${Option.DateJoinChar}MM${Option.DateJoinChar}dd`;
        let Result = Option.Format;
        Result = Result.replaceAll('yyyy', QueryDate.Year.toString().padStart(4, '0'));
        Result = Result.replaceAll('MM', QueryDate.Month.toString().padStart(2, '0'));
        Result = Result.replaceAll('dd', QueryDate.Day.toString().padStart(2, '0'));
        Option.Format = Result;
        return Result;
    }
    ToDateTimeText(QueryDate, Option) {
        Option ??= {};
        if (typeof Option == 'string')
            Option = { Format: Option };
        Option.DateJoinChar ??= this.$DefaultDateJoinChar;
        Option.Format ??= `yyyy${Option.DateJoinChar}MM${Option.DateJoinChar}dd HH:mm:ss`;
        Option = { ...Option };
        QueryDate = this.$CreateDateInfo(QueryDate);
        this.ToDateText(QueryDate, Option);
        let Result = Option.Format;
        Result = Result.replaceAll('HH', QueryDate.Hour.toString().padStart(2, '0'));
        Result = Result.replaceAll('mm', QueryDate.Minute.toString().padStart(2, '0'));
        Result = Result.replaceAll('ss', QueryDate.Second.toString().padStart(2, '0'));
        return Result;
    }
    $CreateDateInfo(DateOrText) {
        DateOrText ??= new Date();
        if (typeof DateOrText === 'string')
            DateOrText = new Date(DateOrText);
        if (DateOrText instanceof Date == false)
            return DateOrText;
        let Result = {
            Date: DateOrText,
            Year: DateOrText.getFullYear(),
            Month: DateOrText.getMonth() + 1,
            Day: DateOrText.getDate(),
            Hour: DateOrText.getHours(),
            Minute: DateOrText.getMinutes(),
            Second: DateOrText.getSeconds(),
        };
        return Result;
    }
    //#endregion
    //#region Process
    ConvertTo_UrlQuery(Param) {
        if (typeof Param === 'string')
            return Param;
        let AllParam = [];
        this.ForEachObject(Param, (Key, Value) => {
            AllParam.push(`${Key}=${Value}`);
        });
        let QueryString = AllParam.join('&');
        return QueryString;
    }
    ClearUrl(ApiUrl) {
        let ClearUrl = ApiUrl.replace(/^\/+|\/+$/g, '');
        return ClearUrl;
    }
    ToJoin(Value, Separator = '.') {
        let ConvertArray = this.Paths(Value);
        let Result = ConvertArray.join(Separator);
        return Result;
    }
    Paths(...Value) {
        if (!Array.isArray(Value))
            return [Value];
        let Result = [];
        for (let Item of Value) {
            if (Item == null)
                continue;
            if (!Array.isArray(Item)) {
                Result.push(Item);
                continue;
            }
            if (Item.length == 0)
                continue;
            Result.push(...this.Paths(...Item));
        }
        return Result;
    }
    //#endregion
    //#region Console And Throw
    $Throw(Message) {
        throw new Error(Message);
    }
    $Error(Data) {
        console.error(Data);
    }
}
//#endregion
//#region DomQueryer
class QueryNode extends FuncBase {
    Dom;
    DomName = null;
    Parent = null;
    Children = [];
    ElementDeep = 0;
    NodeDeep = 0;
    constructor(Dom) {
        super();
        this.Dom = Dom;
    }
    Query(DomName) {
        return this.$RCS_QueryChildren(this, DomName);
    }
    Selector(Selector) {
        return this.Dom.querySelector(Selector);
    }
    SelectorAll(Selector) {
        return this.Dom.querySelectorAll(Selector);
    }
    $RCS_QueryChildren(TargetNode, DomName) {
        if (DomName == null)
            return null;
        DomName = this.Paths(DomName);
        if (DomName.length == 1)
            DomName = DomName[0];
        for (let Item of TargetNode.Children) {
            if (Array.isArray(DomName)) {
                let Names = [...DomName];
                let FirstName = Names.shift();
                if (Item.DomName == FirstName) {
                    if (Names.length == 1)
                        Names = Names[0];
                    let FindChildren = this.$RCS_QueryChildren(Item, Names);
                    if (FindChildren != null)
                        return FindChildren;
                }
            }
            else {
                if (Item.DomName == DomName)
                    return Item;
            }
            let ChildrenResult = this.$RCS_QueryChildren(Item, DomName);
            if (ChildrenResult != null)
                return ChildrenResult;
        }
        return null;
    }
}
class DomQueryer {
    $Root = null;
    $RootNode = null;
    $Nodes = [];
    $QueryDomName = null;
    IsInited = false;
    WithRoot(Filter) {
        this.$Root = document.querySelector(Filter);
        return this;
    }
    WithDomName(QueryDomName) {
        this.$QueryDomName = QueryDomName;
        return this;
    }
    Init(IsReInited = false) {
        if (this.IsInited && !IsReInited)
            return this;
        this.$Root ??= document.body;
        this.$RootNode = new QueryNode(this.$Root);
        this.$RCS_Visit(this.$Root, this.$RootNode, 0);
        this.$Nodes = this.$Nodes.sort((A, B) => A.NodeDeep - B.NodeDeep);
        this.IsInited = true;
        return this;
    }
    Query(DomName, TargetNode) {
        TargetNode ??= this.$RootNode;
        return TargetNode.Query(DomName);
    }
    Using(DomName, UsingFunc, TargetNode) {
        TargetNode ??= this.$RootNode;
        let QueryNode = TargetNode.Query(DomName);
        if (QueryNode != null)
            UsingFunc({
                QueryNode,
                Dom: QueryNode.Dom,
            });
        return this;
    }
    $RCS_Visit(DomNode, Parent, ElementDeep) {
        let NextNode = this.$AddNode(DomNode, Parent, ElementDeep);
        NextNode ??= Parent;
        let Children = DomNode.children;
        if (DomNode instanceof HTMLTemplateElement)
            Children = DomNode.content.children;
        if (Children == null || Children.length == 0)
            return;
        for (let i = 0; i < Children.length; i++) {
            let Item = Children[i];
            if (Item instanceof HTMLElement)
                this.$RCS_Visit(Item, NextNode, ElementDeep + 1);
        }
    }
    $AddNode(Dom, Parent, ElementDeep) {
        if (this.$QueryDomName != null && !Dom.matches(`[${this.$QueryDomName}]`))
            return null;
        let DomName = Dom.getAttribute(this.$QueryDomName);
        let NewNode = new QueryNode(Dom);
        NewNode.DomName = DomName;
        NewNode.ElementDeep = ElementDeep;
        this.$Nodes.push(NewNode);
        if (Parent != null) {
            NewNode.Parent = Parent;
            NewNode.NodeDeep = Parent.NodeDeep + 1;
            Parent.Children.push(NewNode);
        }
        return NewNode;
    }
}
var Queryer = new DomQueryer();
export { DomQueryer, Queryer };
class FileDataType {
    FileId;
    File;
}
//#endregion
class ApiStore extends FuncBase {
    //#region Private Property
    #ApiDomain = null;
    #ApiToken = null;
    #OnEventFunc = {};
    #OnEventName = {
        ApiStore: {
            AddApi: 'AddApi',
            UpdateStore: 'UpdateStore',
            AddStore: 'AddStore',
            SetStore: 'SetStore',
        }
    };
    #Store = {
        FileStore: {},
    };
    #Func_ConvertTo_FormData = [];
    //#endregion
    //#region Protected Property
    $ApiStore = {};
    //#endregion
    constructor() {
        super();
        this.UseFormJsonBody();
    }
    //#region Get/Set Property
    get ApiDomain() {
        if (this.#ApiDomain == null)
            return null;
        return this.ClearUrl(this.#ApiDomain);
    }
    set ApiDomain(ApiDomain) {
        this.#ApiDomain = this.ClearUrl(ApiDomain);
    }
    get OnEventName() {
        return this.#OnEventName;
    }
    get #EventName() {
        return this.OnEventName.ApiStore;
    }
    get Store() {
        return this.#Store;
    }
    set Store(Store) {
        this.#Store = Store;
    }
    get FileStore() {
        return this.Store.FileStore;
    }
    //#endregion
    //#region Public With Method
    WithApiToken(ApiToken) {
        this.#ApiToken = ApiToken;
        return this;
    }
    WithApiDomain(ApiDomain) {
        this.ApiDomain = ApiDomain;
        return this;
    }
    //#endregion
    //#region ConvertTo Method
    WithConvertTo_FormParam(ConvertToFunc) {
        this.#Func_ConvertTo_FormData.push(ConvertToFunc);
        return this;
    }
    ClearConvertTo_FormParam() {
        this.#Func_ConvertTo_FormData = [];
        return this;
    }
    //#endregion
    //#region Api Method
    AddApi(AddApi) {
        for (let ApiKey in AddApi) {
            let ApiOption = AddApi[ApiKey];
            let SetApi = {
                ApiKey,
                ...ApiOption,
            };
            this.$ApiStore[ApiKey] = SetApi;
            this.$EventTrigger(this.#EventName.AddApi, SetApi);
        }
        return this;
    }
    ApiCall(ApiKey, Option = null) {
        this.$BaseApiCall(ApiKey, Option, false);
        return this;
    }
    ApiCall_Form(ApiKey, Option = null) {
        this.$BaseApiCall(ApiKey, Option, true);
        return this;
    }
    $BaseApiCall(ApiKey, Option, IsFormRequest) {
        let Api = this.$ApiStore[ApiKey];
        if (Api == null)
            this.$Throw(`Api setting not found of "${ApiKey}"`);
        let ParamQuery = Option?.Query ?? Api.Query;
        let ParamBody = Option?.Body ?? Api.Body;
        let ParamFile = Option?.File ?? Api.File;
        if (typeof (ParamQuery) == 'function')
            ParamQuery = ParamQuery();
        if (typeof (ParamBody) == 'function')
            ParamBody = ParamBody();
        if (typeof (ParamFile) == 'function')
            ParamFile = ParamFile();
        let IsUpdateStore = Option?.IsUpdateStore ?? Api.IsUpdateStore ?? true;
        let Url = this.$ConvertTo_ApiDomainUrl(Api.Url, ParamQuery);
        let FetchRequest = this.$GenerateFetchRequest(Api, ParamBody, ParamFile, IsFormRequest);
        Api.OnCalling?.call(this, FetchRequest);
        Option?.OnCalling?.call(this, FetchRequest);
        fetch(Url, FetchRequest)
            .then(async (ApiResult) => {
            if (!ApiResult.ok)
                throw ApiResult;
            let ConvertResult = await this.$ProcessApiReturn(ApiResult);
            if (IsUpdateStore) {
                let StoreKey = Api.ApiKey;
                this.UpdateStore(StoreKey, ConvertResult);
            }
            Api.OnSuccess?.call(this, ConvertResult);
            Option?.OnSuccess?.call(this, ConvertResult);
            return ConvertResult;
        })
            .catch(ex => {
            Api.OnError?.call(this, ex);
            Option?.OnError?.call(this, ex);
            this.$Error(ex.message);
        })
            .then(ConvertResult => {
            Api.OnComplete?.call(this, ConvertResult);
            Option?.OnComplete?.call(this, ConvertResult);
        });
    }
    $GenerateFetchRequest(Api, ParamBody, ParamFile, IsFormRequest) {
        let Header = {
            Authorization: this.#ApiToken,
        };
        let FetchRequest = {
            method: Api.Method,
            headers: Header,
        };
        if (IsFormRequest) {
            let SendForm = this.$ConvertTo_FormData(ParamBody, new FormData());
            SendForm = this.$ConvertTo_FormFile(ParamFile, SendForm);
            FetchRequest.body = SendForm;
            FetchRequest.method = 'POST';
        }
        else {
            Header['content-type'] = 'application/json';
            if (Api.Method == 'POST')
                FetchRequest.body = JSON.stringify(ParamBody ?? {});
        }
        return FetchRequest;
    }
    //#endregion
    //#region Default Use Method
    UseFormJsonBody(JsonBodyKey = 'Body') {
        this.WithConvertTo_FormParam((FormDataBody, Form) => {
            let ConvertParam = {};
            ConvertParam[JsonBodyKey] = JSON.stringify(FormDataBody);
            return ConvertParam;
        });
        return this;
    }
    //#endregion
    //#region Public Event Add
    EventAdd_AddApi(EventFunc) {
        this.$EventAdd(this.#EventName.AddApi, EventFunc);
        return this;
    }
    EventAdd_UpdateStore(EventFunc) {
        this.$EventAdd(this.#EventName.UpdateStore, EventFunc);
        return this;
    }
    EventAdd_AddStore(EventFunc) {
        this.$EventAdd(this.#EventName.AddStore, EventFunc);
        return this;
    }
    EventAdd_SetStore(EventFunc) {
        this.$EventAdd(this.#EventName.SetStore, EventFunc);
        return this;
    }
    //#endregion
    //#region Protected Event Process
    $EventAdd(EventName, OnFunc) {
        if (EventName in this.#OnEventFunc == false)
            this.#OnEventFunc[EventName] = [];
        this.#OnEventFunc[EventName].push(OnFunc);
    }
    $EventTrigger(EventName, EventArg) {
        let EventFuncs = this.#OnEventFunc[EventName];
        if (EventFuncs == null)
            return;
        for (let Item of EventFuncs)
            Item(EventArg);
    }
    //#endregion
    //#region Store Control
    //#region Public Data Store Contorl
    UpdateStore(StorePath, StoreData) {
        StorePath = this.ToJoin(StorePath);
        this.$RCS_SetStore(StorePath, StoreData, this.Store, {
            IsDeepSet: true,
        });
        this.$EventTrigger(this.#EventName.UpdateStore, {
            Path: StorePath,
            Data: StoreData,
        });
        return this;
    }
    AddStore(StorePath, StoreData = null) {
        StorePath = this.ToJoin(StorePath);
        if (this.GetStore(StorePath) != null)
            return this;
        this.$RCS_SetStore(StorePath, StoreData, this.Store, {
            IsDeepSet: true,
        });
        this.$EventTrigger(this.#EventName.AddStore, {
            Path: StorePath,
            Data: StoreData,
        });
        return this;
    }
    SetStore(StorePath, StoreData) {
        StorePath = this.ToJoin(StorePath);
        this.$RCS_SetStore(StorePath, StoreData, this.Store, {
            IsDeepSet: false,
        });
        this.$EventTrigger(this.#EventName.SetStore, {
            Path: StorePath,
            Data: StoreData,
        });
        return this;
    }
    GetStore(StorePath, Option) {
        if (typeof Option == 'boolean')
            Option = { Clone: Option };
        Option ??= {};
        Option.Clone ??= false;
        Option.CreateIfNull ??= false;
        Option.DefaultValue ??= {};
        StorePath = this.ToJoin(StorePath);
        let FindStore = this.$RCS_GetStore(StorePath, this.Store, {
            CreateIfNull: Option.CreateIfNull,
            DefaultValue: Option.DefaultValue,
        });
        if (Option.Clone) {
            let CloneResult = {};
            let AllKeys = Object.getOwnPropertyNames(FindStore);
            for (let Key of AllKeys) {
                if (!Key.match(/^\$/g))
                    CloneResult[Key] = FindStore[Key];
            }
            return CloneResult;
        }
        return FindStore;
    }
    ClearStore(StorePath) {
        let TargetStore = this.GetStore(StorePath);
        let AllProperty = Object.getOwnPropertyNames(TargetStore);
        for (let Key of AllProperty) {
            if (Key.match(/^\$/g))
                continue;
            let Value = TargetStore[Key];
            if (typeof (Value) == 'function')
                continue;
            if (Array.isArray(Value)) {
                Value.splice(0, Value.length);
                ;
                continue;
            }
            TargetStore[Key] = null;
        }
        return this;
    }
    //#endregion
    //#region Protected Data Store Process
    $RCS_GetStore(StorePath, FindStore, Option) {
        if (FindStore == null)
            return null;
        let StorePaths = StorePath.split('.');
        let FirstKey = StorePaths.shift();
        if (FindStore[FirstKey] == null && Option.CreateIfNull) {
            if (Array.isArray(Option.DefaultValue))
                FindStore[FirstKey] = [...Option.DefaultValue];
            else if (typeof Option.DefaultValue == 'object')
                FindStore[FirstKey] = { ...Option.DefaultValue };
            else
                FindStore[FirstKey] = Option.DefaultValue;
        }
        let NextStore = FindStore[FirstKey];
        if (StorePaths.length == 0)
            return NextStore;
        let NextKey = StorePaths.join('.');
        return this.$RCS_GetStore(NextKey, NextStore, Option);
    }
    $RCS_SetStore(StorePath, StoreData, FindStore, Option = {
        IsDeepSet: true,
    }) {
        if (StorePath.includes('.')) {
            let StorePaths = StorePath.split('.');
            let FirstKey = StorePaths.shift();
            if (FindStore[FirstKey] == null)
                FindStore[FirstKey] = {};
            let NextStore = FindStore[FirstKey];
            let NextKey = StorePaths.join('.');
            return this.$RCS_SetStore(NextKey, StoreData, NextStore, Option);
        }
        let IsAwaysSet = !Option.IsDeepSet ||
            FindStore[StorePath] == null ||
            StoreData == null || typeof StoreData != 'object';
        if (IsAwaysSet) {
            FindStore[StorePath] = StoreData;
            return StoreData;
        }
        this.$DeepSetObject(StorePath, StoreData, FindStore);
        return StoreData;
    }
    $DeepSetObject(StorePath, SetData, FindStore) {
        if (SetData == null) {
            FindStore[StorePath] = SetData;
            return;
        }
        if (!Array.isArray(SetData)) {
            this.ForEachObject(SetData, (Key, Value) => {
                if (Array.isArray(Value) || typeof Value == 'object') {
                    this.$DeepSetObject(Key, Value, FindStore[StorePath]);
                    return;
                }
                if (FindStore[StorePath] == null)
                    FindStore[StorePath] = {};
                FindStore[StorePath][Key] = Value;
            });
            return;
        }
        if (!Array.isArray(FindStore[StorePath]))
            FindStore[StorePath] = [];
        if (FindStore[StorePath].length > 0)
            FindStore[StorePath].splice(0, FindStore[StorePath].length);
        FindStore[StorePath].push(...SetData);
    }
    //#endregion
    //#region File Store
    AddFileStore(FileStoreKey) {
        if (this.FileStore[FileStoreKey] == null)
            this.FileStore[FileStoreKey] = [];
        return this;
    }
    Files(FileStoreKey, MapFunc = null) {
        let GetFiles = this.FileStore[FileStoreKey];
        if (GetFiles == null)
            return [];
        let MapFiles = MapFunc != null ?
            GetFiles.map(Item => MapFunc(Item)) :
            GetFiles.map(Item => Item['File']);
        return MapFiles;
    }
    //#endregion
    //#endregion
    //#region Protected Process
    $ProcessApiReturn(ApiResponse) {
        let GetContentType = ApiResponse.headers.get("content-type");
        let ConvertSuccess = null;
        if (GetContentType && GetContentType.includes('application/json')) {
            ConvertSuccess = ApiResponse.json()
                .then(GetJson => GetJson);
        }
        else {
            ConvertSuccess = ApiResponse.text()
                .then(GetText => GetText);
        }
        return ConvertSuccess;
    }
    //#endregion
    //#region Protected ConvertTo
    $ConvertTo_ApiDomainUrl(Url, Param = null) {
        let ApiDomainUrl = Url;
        if (this.ApiDomain != null && !ApiDomainUrl.includes('http'))
            ApiDomainUrl = `${this.ApiDomain}/${this.ClearUrl(ApiDomainUrl)}`;
        if (Param != null)
            ApiDomainUrl = `${ApiDomainUrl}?${this.ConvertTo_UrlQuery(Param)}`;
        return ApiDomainUrl;
    }
    $ConvertTo_FormData(ConvertFormData, Form) {
        Form ??= new FormData();
        if (ConvertFormData == null)
            return Form;
        this.#Func_ConvertTo_FormData.forEach(Func => {
            ConvertFormData = Func(ConvertFormData, Form);
        });
        if (ConvertFormData instanceof FormData)
            return ConvertFormData;
        this.ForEachObject(ConvertFormData, (Key, Value) => {
            Form.append(Key, Value);
        });
        return Form;
    }
    $ConvertTo_FormFile(FileParam, Form) {
        Form ??= new FormData();
        if (FileParam == null)
            return Form;
        let DefaultKey = 'Files';
        if (Array.isArray(FileParam)) {
            this.$AppendFileDataArray(DefaultKey, Form, FileParam);
            return Form;
        }
        if (FileParam instanceof File || FileParam instanceof FileDataType) {
            this.$AppendFileData(DefaultKey, Form, FileParam);
            return Form;
        }
        let Keys = Object.keys(FileParam);
        for (let i = 0; i < Keys.length; i++) {
            let FileKey = Keys[i];
            let FileValue = FileParam[FileKey];
            if (Array.isArray(FileValue)) {
                this.$AppendFileDataArray(FileKey, Form, FileValue);
                continue;
            }
            this.$AppendFileData(FileKey, Form, FileValue);
        }
        return Form;
    }
    $AppendFileDataArray(FileKey, Form, FileDatas) {
        FileDatas.forEach(FileData => {
            this.$AppendFileData(FileKey, Form, FileData);
        });
        return Form;
    }
    $AppendFileData(FileKey, Form, FileData) {
        if (FileData instanceof File)
            Form.append(FileKey, FileData);
        else
            Form.append(FileKey, FileData.File);
        return Form;
    }
}
import { createApp, reactive } from 'vue';
class VueStore extends ApiStore {
    $VueProxy = null;
    $VueOption = {
        methods: {},
        components: {},
        watch: {},
        computed: {},
    };
    $VueApp = null;
    $VueUse = [];
    $MountedFuncs = [];
    constructor() {
        super();
        this.#Setup();
    }
    //#region Private Setup
    #Setup() {
        this
            .EventAdd_AddApi(Arg => {
            this.AddStore(Arg.ApiKey);
        })
            .EventAdd_UpdateStore(() => {
            this.ForceUpdate();
        })
            .EventAdd_AddStore(() => {
            this.ForceUpdate();
        })
            .EventAdd_SetStore(() => {
            this.ForceUpdate();
        });
    }
    //#endregion
    //#region Get/Set Property
    get Store() {
        if (this.$VueProxy != null)
            return this.$VueProxy;
        return super.Store;
    }
    set Store(Store) {
        super.Store = Store;
    }
    //#endregion
    //#region Public With Method
    WithVueOption(VueOption = {}) {
        this.$VueOption = this.DeepObjectExtend(this.$VueOption, VueOption);
        return this;
    }
    WithMounted(MountedFunc = () => { }) {
        this.$MountedFuncs.push(MountedFunc);
        return this;
    }
    WithComponent(Component = {}) {
        this.$VueOption.components = this.DeepObjectExtend(this.$VueOption.components, Component);
        return this;
    }
    WithVueUse(...UsePlugin) {
        for (let Item of UsePlugin) {
            this.$VueUse.push(Item);
        }
        return this;
    }
    //#endregion
    //#region Public Method
    ForceUpdate() {
        this.$VueProxy?.$forceUpdate();
        return this;
    }
    Refs(RefName) {
        if (!this.$VueProxy)
            return null;
        return this.$VueProxy[RefName];
    }
}
class VueCmd extends VueStore {
    $IsInited = false;
    $QueryDomName = null;
    //#region With Method
    WithQueryAttribute(QueryDomName) {
        this.$QueryDomName = QueryDomName;
        return this;
    }
    //#endregion
    //#region Path Command
    AddV_Text(DomName, Option) {
        let SetOption = this.$ConvertCommandOption(DomName, Option);
        if (typeof SetOption.Target != 'function')
            Model.AddStore(SetOption.Target);
        this.$AddCommand(DomName, 'v-text', SetOption);
        return this;
    }
    AddV_Model(DomName, StorePath, Option) {
        let SetOption = this.$ConvertCommandOption(StorePath);
        Option ??= {};
        Option.DefaultValue ??= null;
        SetOption.CommandKey = Option.ModelValue;
        this.AddStore(StorePath, Option.DefaultValue);
        this.$AddCommand(DomName, 'v-model', SetOption);
        return this;
    }
    AddV_Slot(DomName, SlotKey, StorePath) {
        let SetOption = this.$ConvertCommandOption(StorePath);
        SetOption.CommandKey = SlotKey;
        this.$AddCommand(DomName, `v-slot`, SetOption);
        return this;
    }
    //#endregion
    //#region Path/Function Command
    AddV_For(DomName, Option, ForKey) {
        let SetOption = this.$ConvertCommandOption(DomName, Option);
        if (ForKey) {
            ForKey = this.ToJoin(ForKey);
            SetOption.TargetHead = `(${ForKey}) in `;
        }
        SetOption.TargetHead ??= '(item, index) in ';
        this.$AddCommand(DomName, 'v-for', SetOption);
        return this;
    }
    AddV_If(DomName, Option) {
        let SetOption = this.$ConvertCommandOption(DomName, Option);
        this.$AddCommand(DomName, 'v-if', SetOption);
        return this;
    }
    AddV_Show(DomName, Option) {
        let SetOption = this.$ConvertCommandOption(DomName, Option);
        this.$AddCommand(DomName, 'v-show', SetOption);
        return this;
    }
    AddV_Bind(DomName, BindKey, Option) {
        let SetOption = this.$ConvertCommandOption(DomName, Option);
        SetOption.CommandKey = BindKey;
        this.$AddCommand(DomName, 'v-bind', SetOption);
        return this;
    }
    AddV_On(DomName, EventName, Option) {
        let SetOption = this.$ConvertCommandOption(DomName, Option);
        SetOption.FuncAction = false;
        SetOption.CommandKey = EventName;
        this.$AddCommand(DomName, `v-on`, SetOption);
        return this;
    }
    //#endregion
    //#region Customer Command
    AddV_OnChange(DomName, ChangeFunc) {
        this.AddV_On(DomName, 'change', ChangeFunc);
        return this;
    }
    AddV_Click(DomName, Option, Args) {
        let SetOption = this.$ConvertCommandOption(DomName, Option);
        if (Args)
            SetOption.FuncArgs = Args;
        this.AddV_On(DomName, 'click', SetOption);
        return this;
    }
    AddV_Function(FuncName, Func) {
        if (this.$IsInited && !Array.isArray(FuncName))
            this.$VueOption.methods[FuncName] = Func;
        else
            Model.UpdateStore(FuncName, Func);
        return this;
    }
    AddV_Watch(WatchPath, Func, Deep = false, Option = {}) {
        let SetWatch = {
            handler: Func,
            deep: Deep,
            ...Option,
        };
        this.$VueOption.watch[this.ToJoin(WatchPath)] = SetWatch;
        return this;
    }
    AddV_Tree(TreeRoot, TreeSet) {
        let AllSetInfo = [];
        let RootPaths = this.Paths(TreeRoot);
        let AllKeys = Object.keys(TreeSet);
        this.$ParseTreeSet(RootPaths, TreeSet, AllSetInfo);
        let CommandMap = {
            'v-text': Info => {
                Model.AddV_Text(Info.Paths, Info.StoreValue);
            },
            'v-model': Info => {
                if (typeof (Info.StoreValue) == 'function') {
                    Model.$Error(`v-model command value must be a string or string[], path: ${this.ToJoin(Info.Paths)}`);
                    return;
                }
                Model.AddV_Model(Info.Paths, Info.StoreValue, {
                    ModelValue: Info.CommandKey,
                });
            },
            'v-for': Info => {
                Model.AddV_For(Info.Paths, Info.StoreValue, Info.CommandKey);
            },
            'v-if': Info => {
                Model.AddV_If(Info.Paths, Info.StoreValue);
            },
            'v-show': Info => {
                Model.AddV_Show(Info.Paths, Info.StoreValue);
            },
            'v-bind': Info => {
                Model.AddV_Bind(Info.Paths, Info.CommandKey, Info.StoreValue);
            },
            'v-on': Info => {
                Model.AddV_On(Info.Paths, Info.CommandKey, Info.StoreValue);
            },
            'v-slot': Info => {
                if (Array.isArray(Info.StoreValue) || typeof (Info.StoreValue) == 'function') {
                    Model.$Error(`v-slot command value must be a string, path: ${this.ToJoin(Info.Paths)}`);
                    return;
                }
                Model.AddV_Slot(Info.Paths, Info.CommandKey, Info.StoreValue);
            },
            'watch': Info => {
                if (typeof (Info.StoreValue) != 'function') {
                    Model.$Error(`watch command value must be a function, path: ${this.ToJoin(Info.Paths)}`);
                    return;
                }
                Model.AddV_Watch(Info.Paths, Info.StoreValue);
            },
            'func': Info => {
                if (typeof (Info.StoreValue) != 'function') {
                    Model.$Error(`func command value must be a function, path: ${this.ToJoin(Info.Paths)}`);
                    return;
                }
                Model.AddV_Function(['event', ...Info.Paths, Info.CommandKey], Info.StoreValue);
            }
        };
        for (let Info of AllSetInfo) {
            let ActionSet = CommandMap[Info.Command];
            if (ActionSet == null) {
                Model.$Error(`${Info.Command} command is not allowed, path: ${this.ToJoin(Info.Paths)}`);
                continue;
            }
            ActionSet(Info);
        }
        return this;
    }
    $ParseTreeSet(Paths, TreeSet, Result) {
        let AllKeys = Object.keys(TreeSet);
        for (let i = 0; i < AllKeys.length; i++) {
            let Command = AllKeys[i];
            let Value = TreeSet[Command];
            if (!Command.includes(':')) {
                Result.push({
                    Command: Command,
                    StoreValue: Value == '.' ? [...Paths] : Value,
                    Paths: [...Paths],
                });
                continue;
            }
            let Commands = Command.split(':');
            if (Command.length < 2) {
                Model.$Error(`command ${Command} invalid`);
                continue;
            }
            Command = Commands.shift();
            let CommandKey = Model.ToJoin(Commands, ':');
            if (Command != '') {
                Result.push({
                    Command: Command,
                    CommandKey: CommandKey,
                    StoreValue: Value,
                    Paths: [...Paths],
                });
                continue;
            }
            let DomName = CommandKey;
            this.$ParseTreeSet([...Paths, DomName], Value, Result);
        }
    }
    //#endregion
    //#region Property Method
    AddV_Property(PropertyPath, Option) {
        let SetStore = this.Store;
        PropertyPath = this.ToJoin(PropertyPath);
        let PropertyKey = PropertyPath;
        if (PropertyPath.includes('.')) {
            let PropertyPaths = PropertyPath.split('.');
            PropertyKey = PropertyPaths.pop();
            let FindPath = PropertyPaths.join('.');
            SetStore = this.GetStore(FindPath, {
                CreateIfNull: true,
                DefaultValue: {},
            });
        }
        let SetProperty = this.$BaseAddProperty(SetStore, PropertyKey, Option);
        if (Option.Bind) {
            if (!Array.isArray(Option.Bind))
                Option.Bind = [Option.Bind];
            for (let BindPath of Option.Bind) {
                this.AddV_Property(BindPath, {
                    Target: PropertyPath,
                });
            }
            SetProperty['Bind'] = Option.Bind;
        }
        return this;
    }
    $BaseAddProperty(PropertyStore, PropertyKey, Option) {
        let ThisModel = this;
        let PropertyContent = {
            get() {
                if (Option.get)
                    return Option.get();
                return this.$get(PropertyKey);
            },
            set(Value) {
                if (Option.set) {
                    Option.set(Value);
                    return;
                }
                this.$set(PropertyKey, Value);
            }
        };
        if (Option.get)
            PropertyContent.get = Option.get;
        if (Option.set != null)
            PropertyContent.set = Option.set;
        let SetProperty = Object.defineProperty(PropertyStore, PropertyKey, PropertyContent);
        SetProperty.$properties ??= {};
        SetProperty.$properties[PropertyKey] = { ...Option };
        SetProperty.$get ??= (PropertyKey) => {
            let PropertyOption = SetProperty.$properties[PropertyKey];
            if (PropertyOption?.Target == null)
                return PropertyOption[`$${PropertyKey}`];
            return ThisModel.GetStore(PropertyOption.Target);
        };
        SetProperty.$set ??= (PropertyKey, Value) => {
            let PropertyOption = SetProperty.$properties[PropertyKey];
            if (PropertyOption?.Target)
                ThisModel.SetStore(PropertyOption.Target, Value);
            else
                PropertyOption[`$${PropertyKey}`] = Value;
        };
        if (Option.Value != null)
            SetProperty[PropertyKey] = Option.Value;
        return SetProperty;
    }
    //#endregion
    //#region Protected Process
    $ConvertCommandOption(DomName, Option) {
        if (!Option)
            return { Target: DomName, FuncAction: true };
        if (typeof Option == 'string' || typeof Option == 'function' || Array.isArray(Option))
            return { Target: Option, FuncAction: true };
        Option.FuncAction ??= true;
        return Option;
    }
    $AddCommand(DomName, Command, Option) {
        Queryer.WithDomName(this.$QueryDomName);
        if (!Queryer.IsInited)
            Queryer.Init();
        let Target = Option.Target;
        Queryer.Using(DomName, ({ Dom }) => {
            if (typeof (Target) == 'function') {
                Target = this.$GenerateEventFunction(DomName, Target, Command);
                if (Option.FuncArgs) {
                    let Args = this.ToJoin(Option.FuncArgs, ',');
                    Target += `(${Args})`;
                }
                else if (Option.FuncAction) {
                    Target += `()`;
                }
            }
            else
                Target = this.ToJoin(Target);
            if (Option.TargetHead)
                Target = Option.TargetHead + Target;
            if (Option.TargetTail)
                Target += Option.TargetTail;
            if (Option.CommandKey)
                Command += `:${Option.CommandKey}`;
            this.$SetAttribute(Dom, Command, Target);
        });
    }
    $SetAttribute(Dom, AttrName, AttrValue) {
        if (Dom == null) {
            let Message = `Dom Element is null. ${AttrValue}`;
            console.warn(Message);
            return;
        }
        Dom.setAttribute(AttrName, AttrValue);
    }
    //#region Function Control
    $RandomFuncName(BaseFuncName) {
        return `${BaseFuncName}${this.GenerateIdReplace('')}`.replace(/[-:.]/g, '_');
    }
    $GenerateEventFunction(DomName, EventFunc, Command) {
        let FuncName = this.$RandomFuncName(`${Command}_`);
        DomName = this.Paths(DomName);
        let FullFuncPath = ['event', ...DomName, FuncName];
        this.AddV_Function(FullFuncPath, EventFunc);
        return this.ToJoin(FullFuncPath);
    }
}
class VueModel extends VueCmd {
    $MountId = null;
    Id;
    constructor() {
        super();
        this.Id = this.GenerateId();
    }
    //#region With Method
    WithMountId(MountId) {
        this.$MountId = MountId;
        return this;
    }
    //#endregion
    //#region Public Method
    Init() {
        if (this.$IsInited)
            return this;
        this.Store = reactive(this.Store);
        let GetStore = this.Store;
        let MountedFunc = this.$MountedFuncs;
        this.$VueApp = createApp({
            ...this.$VueOption,
            data() {
                return GetStore;
            },
            mounted: () => {
                for (let Func of MountedFunc)
                    Func();
            }
        });
        for (let Item of this.$VueUse)
            this.$VueApp.use(Item);
        this.$VueProxy = this.$VueApp.mount(`#${this.$MountId}`);
        this.$IsInited = true;
        return this;
    }
    Using(UseFunc = () => { }) {
        UseFunc();
        return this;
    }
}
const Model = new VueModel();
window.Model = Model;
export { Model, VueModel, FuncBase, ApiStore, VueStore, };
//# sourceMappingURL=VueModel.js.map