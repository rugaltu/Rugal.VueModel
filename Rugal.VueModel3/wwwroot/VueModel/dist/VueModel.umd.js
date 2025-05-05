(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "vue"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VueStore = exports.ApiStore = exports.FuncBase = exports.VueModel = exports.Model = exports.Queryer = exports.DomQueryer = void 0;
    class FuncBase {
        $NavigateToFunc;
        $DefaultDateJoinChar;
        constructor() {
            this.$NavigateToFunc = null;
            this.WithDateTextJoinChar('-');
        }
        WithNavigateTo(NavigateToFunc) {
            this.$NavigateToFunc = NavigateToFunc;
            return this;
        }
        WithDateTextJoinChar(JoinChar) {
            this.$DefaultDateJoinChar = JoinChar;
            return this;
        }
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
        $BaseGenerateUrl(Url, UrlParam = null) {
            Url = this.Paths(Url);
            if (Url == null || Url.length == 0 || Url[0].length == 0)
                this.$Throw('Url can not be null or empty');
            Url = Url.map(Item => Item.replace(/\/+$/g, '').replace(/^\/+/g, '/'));
            let CombineUrl = this.ToJoin(Url, '/');
            if (UrlParam != null) {
                UrlParam = this.ConvertTo_UrlQuery(UrlParam);
                CombineUrl += `?${UrlParam}`;
            }
            return CombineUrl;
        }
        $BaseNavigateTo(Url) {
            if (this.$NavigateToFunc)
                this.$NavigateToFunc(Url);
            else
                window.location.href = Url;
        }
        NavigateToRoot() {
            let RootUrl = '/';
            this.$BaseNavigateTo(RootUrl);
            return this;
        }
        NavigateTo(Url, UrlParam = null) {
            let TargetUrl = this.$BaseGenerateUrl(Url, UrlParam);
            this.$BaseNavigateTo(TargetUrl);
            return this;
        }
        $BaseNavigateBlank(Url) {
            let Link = document.createElement('a');
            Link.href = Url;
            Link.target = '_blank';
            Link.rel = 'noopener noreferrer';
            Link.click();
        }
        NavigateBlank(Url, UrlParam = null) {
            let TargetUrl = this.$BaseGenerateUrl(Url, UrlParam);
            this.$BaseNavigateBlank(TargetUrl);
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
        IsPathType(CheckPathType) {
            if (Array.isArray(CheckPathType)) {
                for (let Item of CheckPathType) {
                    let IsTrue = this.IsPathType(Item);
                    if (!IsTrue)
                        return false;
                }
                return true;
            }
            else if (typeof (CheckPathType) == 'string') {
                return true;
            }
            return false;
        }
        $Throw(Message) {
            throw new Error(Message);
        }
        $Error(Data) {
            console.error(Data);
        }
    }
    exports.FuncBase = FuncBase;
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
        Query(DomName, Option) {
            return this.$RCS_QueryChildrens(this, DomName, Option);
        }
        Selector(Selector) {
            return this.Dom.querySelector(Selector);
        }
        SelectorAll(Selector) {
            return this.Dom.querySelectorAll(Selector);
        }
        $RCS_QueryChildrens(TargetNode, DomName, Option) {
            if (DomName == null)
                return null;
            DomName = this.Paths(DomName);
            if (DomName.length == 1)
                DomName = DomName[0];
            let Results = [];
            for (let Item of TargetNode.Children) {
                if (Array.isArray(DomName)) {
                    let Names = [...DomName];
                    let FirstName = Names.shift();
                    if (Item.DomName == FirstName) {
                        if (Names.length == 1)
                            Names = Names[0];
                        let FindChildren = this.$RCS_QueryChildrens(Item, Names, Option);
                        if (FindChildren != null) {
                            Results.push(...FindChildren);
                            continue;
                        }
                    }
                }
                else if (Item.DomName == DomName) {
                    Results.push(Item);
                    if (Option.Mode == 'Multi')
                        continue;
                }
                let ChildrenResult = this.$RCS_QueryChildrens(Item, DomName, Option);
                if (ChildrenResult != null)
                    Results.push(...ChildrenResult);
            }
            return Results;
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
        Query(DomName, Option) {
            if (!Queryer.IsInited)
                Queryer.Init();
            if (Option == null) {
                Option = {
                    Mode: 'Multi',
                };
            }
            else if (Option instanceof QueryNode) {
                Option = {
                    Mode: 'Multi',
                    TargetNode: Option,
                };
            }
            if (Option.TargetNode == null)
                Option.TargetNode = this.$RootNode;
            return Option.TargetNode.Query(DomName, Option);
        }
        Using(DomName, UsingFunc, TargetNode) {
            let QueryNodes = this.Query(DomName, {
                Mode: 'Multi',
                TargetNode: TargetNode,
            });
            if (QueryNodes != null && QueryNodes.length > 0) {
                UsingFunc({
                    QueryNodes,
                });
            }
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
    exports.DomQueryer = DomQueryer;
    var Queryer = new DomQueryer();
    exports.Queryer = Queryer;
    class FileItem {
        FileId;
        File;
        Base64;
        Buffer;
        ConvertType;
        constructor(FileId, File, ConvertType = 'none') {
            this.FileId = FileId;
            this.File = File;
            this.ConvertType = ConvertType;
            this.$ConvertFile();
        }
        $ConvertFile() {
            if (this.ConvertType == null)
                return;
            let GetConvertType = [];
            if (Array.isArray(this.ConvertType))
                GetConvertType = this.ConvertType;
            else
                GetConvertType = [this.ConvertType];
            for (let i = 0; i < GetConvertType.length; i++) {
                let TypeItem = GetConvertType[i];
                switch (TypeItem) {
                    case 'base64':
                        this.$ConvertBase64();
                        break;
                    case 'buffer':
                        this.$ConvertBuffer();
                        break;
                    default:
                        break;
                }
            }
        }
        $ConvertBase64(IsForce = false) {
            if (this.File == null)
                return this;
            if (this.Base64 != null && IsForce == false)
                return this;
            let Reader = new FileReader();
            Reader.readAsDataURL(this.File);
            Reader.onload = () => this.Base64 = Reader.result;
            return this;
        }
        $ConvertBuffer() {
            let Reader = new FileReader();
            Reader.readAsArrayBuffer(this.File);
            Reader.onload = () => this.Buffer = Reader.result;
        }
    }
    class ApiStore extends FuncBase {
        #ApiDomain = null;
        #RootRoute = null;
        #AccessToken = null;
        #RefreshToken = null;
        #HeaderFuncs = [];
        #OnEventFunc = {};
        #OnEventName = {
            ApiStore: {
                AddApi: 'AddApi',
                UpdateStore: 'UpdateStore',
                AddStore: 'AddStore',
                SetStore: 'SetStore',
            }
        };
        #OnSuccess;
        #OnError;
        #OnComplete;
        #ExportSuccessStore;
        #Store = {
            FileStore: {},
        };
        #Func_ConvertTo_FormData = [];
        $ApiStore = {};
        constructor() {
            super();
            this.UseFormJsonBody();
        }
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
        WithAccessToken(AccessToken) {
            this.#AccessToken = AccessToken;
            return this;
        }
        WithRefreshToken(RefreshToken) {
            this.#RefreshToken = RefreshToken;
            return this;
        }
        WithApiDomain(ApiDomain) {
            this.ApiDomain = ApiDomain;
            return this;
        }
        WithRootRoute(Route) {
            this.#RootRoute = Route;
            return this;
        }
        WithHeader(Func) {
            this.#HeaderFuncs.push(Func);
            return this;
        }
        WithOnSuccess(SuccessFunc) {
            this.#OnSuccess = SuccessFunc;
            return this;
        }
        WithOnError(ErrorFunc) {
            this.#OnError = ErrorFunc;
            return this;
        }
        WithOnComplete(CompleteFunc) {
            this.#OnComplete = CompleteFunc;
            return this;
        }
        WithExportSuccessStore(ExportSuccessStoreFunc) {
            this.#ExportSuccessStore = ExportSuccessStoreFunc;
            return this;
        }
        WithConvertTo_FormParam(ConvertToFunc) {
            this.#Func_ConvertTo_FormData.push(ConvertToFunc);
            return this;
        }
        ClearConvertTo_FormParam() {
            this.#Func_ConvertTo_FormData = [];
            return this;
        }
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
                .then(async (ApiResponse) => {
                if (!ApiResponse.ok)
                    throw ApiResponse;
                let ConvertResult = await this.$ProcessApiReturn(ApiResponse);
                if (IsUpdateStore) {
                    if (this.#ExportSuccessStore != null) {
                        ConvertResult = this.#ExportSuccessStore?.call(this, ConvertResult, ApiResponse);
                    }
                    let StoreKey = Api.ApiKey;
                    this.UpdateStore(StoreKey, ConvertResult);
                }
                Api.OnSuccess?.call(this, ConvertResult, ApiResponse);
                Option?.OnSuccess?.call(this, ConvertResult, ApiResponse);
                this.#OnSuccess?.call(this, ConvertResult, ApiResponse);
                return { ConvertResult, ApiResponse };
            })
                .catch(ex => {
                this.$Error(ex.message);
                Api.OnError?.call(this, ex);
                Option?.OnError?.call(this, ex);
                this.#OnError?.call(this, ex);
            })
                .then(Result => {
                if (Result instanceof Object) {
                    Api.OnComplete?.call(this, Result.ConvertResult, Result.ApiResponse);
                    Option?.OnComplete?.call(this, Result.ConvertResult, Result.ApiResponse);
                    this.#OnComplete?.call(this, Result.ConvertResult, Result.ApiResponse);
                }
                else {
                    Api.OnComplete?.call(this);
                    Option?.OnComplete?.call(this);
                    this.#OnComplete?.call(this, null, null);
                }
            });
        }
        $GenerateFetchRequest(Api, ParamBody, ParamFile, IsFormRequest) {
            let Header = new Headers();
            Header.set('Authorization', `Bearer ${this.#AccessToken}`);
            if (this.#HeaderFuncs.length > 0) {
                for (let Func of this.#HeaderFuncs) {
                    Func(Header);
                }
            }
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
                Header.set('content-type', 'application/json');
                if (Api.Method == 'POST')
                    FetchRequest.body = JSON.stringify(ParamBody ?? {});
            }
            return FetchRequest;
        }
        UseFormJsonBody(JsonBodyKey = 'Body') {
            this.WithConvertTo_FormParam((FormDataBody, Form) => {
                let ConvertParam = {};
                ConvertParam[JsonBodyKey] = JSON.stringify(FormDataBody);
                return ConvertParam;
            });
            return this;
        }
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
            if (Option.DefaultValue == null)
                Option.DefaultValue = {};
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
        AddFileStore(FileStoreKey) {
            if (this.FileStore[FileStoreKey] == null)
                this.FileStore[FileStoreKey] = [];
            return this;
        }
        Files(FileStoreKey, WhereFunc = null) {
            let GetFiles = this.FileStore[FileStoreKey];
            if (GetFiles == null)
                return [];
            if (WhereFunc != null)
                GetFiles = GetFiles.filter(Item => WhereFunc(Item));
            let Result = GetFiles.map(Item => Item.File);
            return Result;
        }
        AddFile(FileStoreKey, AddFile, ConvertType = 'none') {
            this.AddFileStore(FileStoreKey);
            let GetStore = this.FileStore[FileStoreKey];
            if (Array.isArray(AddFile))
                AddFile.forEach(Item => this.AddFile(FileStoreKey, Item));
            else if (AddFile instanceof FileItem) {
                GetStore.push(AddFile);
            }
            else {
                let NewFile = new FileItem(this.GenerateId(), AddFile, ConvertType);
                GetStore.push(NewFile);
            }
            return this;
        }
        RemoveFile(FileStoreKey, DeleteFileId) {
            let GetStore = this.FileStore[FileStoreKey];
            if (GetStore == null)
                return this;
            if (Array.isArray(DeleteFileId))
                DeleteFileId.forEach(Item => this.RemoveFile(FileStoreKey, Item));
            else {
                let DeleteIndex = GetStore.findIndex(Item => Item.FileId == DeleteFileId);
                if (DeleteIndex >= 0)
                    GetStore.splice(DeleteIndex, 1);
            }
            return this;
        }
        ClearFile(FileStoreKey) {
            let GetStore = this.FileStore[FileStoreKey];
            if (GetStore == null)
                return this;
            GetStore.splice(0, GetStore.length);
            return this;
        }
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
        NavigateToRoot() {
            let RootUrl = this.#RootRoute ?? '/';
            super.$BaseNavigateTo(RootUrl);
            return this;
        }
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
                this.$AppendFileToFormData(DefaultKey, Form, FileParam);
                return Form;
            }
            if (FileParam instanceof File || FileParam instanceof FileItem) {
                this.$AppendFileToFormData(DefaultKey, Form, FileParam);
                return Form;
            }
            let Keys = Object.keys(FileParam);
            for (let i = 0; i < Keys.length; i++) {
                let FileKey = Keys[i];
                let FileValue = FileParam[FileKey];
                this.$AppendFileToFormData(FileKey, Form, FileValue);
            }
            return Form;
        }
        $AppendFileToFormData(FileKey, Form, FileData) {
            if (Array.isArray(FileData)) {
                for (let i = 0; i < FileData.length; i++)
                    this.$AppendFileToFormData(FileKey, Form, FileData[i]);
            }
            else if (FileData instanceof File)
                Form.append(FileKey, FileData);
            else
                Form.append(FileKey, FileData.File);
            return Form;
        }
    }
    exports.ApiStore = ApiStore;
    const vue_1 = require("vue");
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
        get Store() {
            if (this.$VueProxy != null)
                return this.$VueProxy;
            return super.Store;
        }
        set Store(Store) {
            super.Store = Store;
        }
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
    exports.VueStore = VueStore;
    class VueCommand extends VueStore {
        $IsInited = false;
        $QueryDomName = null;
        WithQueryDomName(QueryDomName) {
            this.$QueryDomName = QueryDomName;
            Queryer.WithDomName(this.$QueryDomName);
            return this;
        }
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
        AddV_ElseIf(DomName, Option) {
            let SetOption = this.$ConvertCommandOption(DomName, Option);
            this.$AddCommand(DomName, 'v-else-if', SetOption);
            return this;
        }
        AddV_Else(DomName) {
            let SetOption = this.$ConvertCommandOption(DomName);
            SetOption.Target = '';
            this.$AddCommand(DomName, 'v-else', SetOption);
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
        AddV_Watch(WatchPath, Func, Deep = false, Option = {}) {
            let SetWatch = {
                handler: Func,
                deep: Deep,
                ...Option,
            };
            this.$VueOption.watch[this.ToJoin(WatchPath)] = SetWatch;
            return this;
        }
        AddV_Function(FuncName, Func) {
            if (this.$IsInited && !Array.isArray(FuncName))
                this.$VueOption.methods[FuncName] = Func;
            else
                Model.UpdateStore(FuncName, Func);
            return this;
        }
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
        AddV_FilePicker(DomName, Option) {
            let FileStorePath = null;
            let Accept = null;
            let ConvertType = 'none';
            let Multiple = false;
            if (typeof (Option) == 'string')
                FileStorePath = Option;
            else {
                FileStorePath = Option.StorePath;
                ConvertType = Option.ConvertType;
                Multiple = Option.Multiple;
                if (Array.isArray(Option.Accept))
                    Accept = Option.Accept.join(' ');
                else
                    Accept = Option.Accept;
            }
            this.AddFileStore(FileStorePath);
            this.AddV_Click(DomName, () => {
                let TempInput = document.createElement('input');
                TempInput.type = 'file';
                if (Accept != null)
                    TempInput.accept = Accept;
                if (Multiple != null)
                    TempInput.multiple = Multiple;
                TempInput.onchange = (Event) => {
                    if (TempInput.files == null || TempInput.files.length == 0)
                        return;
                    let Files = TempInput.files;
                    for (let i = 0; i < Files.length; i++) {
                        let PickFile = Files[i];
                        this.AddFile(FileStorePath, PickFile, ConvertType);
                    }
                };
                TempInput.click();
            });
            return this;
        }
        AddV_Tree(TreeRoot, TreeSet, Option) {
            let AllSetInfo = [];
            let RootPaths = this.Paths(TreeRoot);
            this.$ParseTreeSet(RootPaths, TreeSet, AllSetInfo);
            let CommandMap = {
                'v-text': (Info, Option) => {
                    Model.AddV_Text(Option.TargetDom, Option.TargetValue);
                },
                'v-model': (Info, Option) => {
                    if (typeof (Info.StoreValue) == 'function') {
                        Model.$Error(`v-model command value must be a string or string[], path: ${this.ToJoin(Info.DomPaths)}`);
                        return;
                    }
                    Model.AddV_Model(Option.TargetDom, Option.TargetPath, {
                        ModelValue: Info.CommandKey,
                    });
                },
                'v-for': (Info, Option) => {
                    Model.AddV_For(Option.TargetDom, Option.TargetValue, Info.CommandKey);
                },
                'v-if': (Info, Option) => {
                    Model.AddV_If(Option.TargetDom, Option.TargetValue);
                },
                'v-else-if': (Info, Option) => {
                    Model.AddV_ElseIf(Option.TargetDom, Option.TargetValue);
                },
                'v-else': (Info, Option) => {
                    Model.AddV_Else(Option.TargetDom);
                },
                'v-show': (Info, Option) => {
                    Model.AddV_Show(Option.TargetDom, Option.TargetValue);
                },
                'v-bind': (Info, Option) => {
                    Model.AddV_Bind(Option.TargetDom, Info.CommandKey, Option.TargetValue);
                },
                'v-on': (Info, Option) => {
                    Model.AddV_On(Option.TargetDom, Info.CommandKey, Option.TargetValue);
                },
                'v-slot': (Info, Option) => {
                    if (Array.isArray(Info.StoreValue) || typeof (Info.StoreValue) == 'function') {
                        Model.$Error(`v-slot command value must be a string, path: ${this.ToJoin(Info.DomPaths)}`);
                        return;
                    }
                    Model.AddV_Slot(Option.TargetDom, Info.CommandKey, Option.TargetPath);
                },
                'watch': (Info, Option) => {
                    if (typeof (Info.StoreValue) != 'function') {
                        Model.$Error(`watch command value must be a function, path: ${this.ToJoin(Info.DomPaths)}`);
                        return;
                    }
                    Model.AddV_Watch(Info.DomPaths, Info.StoreValue);
                },
                'func': (Info, Option) => {
                    if (typeof (Info.StoreValue) != 'function') {
                        Model.$Error(`func command value must be a function, path: ${this.ToJoin(Info.DomPaths)}`);
                        return;
                    }
                    Model.AddV_Function(['event', ...Info.DomPaths, Info.CommandKey], Info.StoreValue);
                }
            };
            for (let Info of AllSetInfo) {
                let ActionSet = CommandMap[Info.Command];
                if (ActionSet == null) {
                    Model.$Error(`${Info.Command} command is not allowed, path: ${this.ToJoin(Info.DomPaths)}`);
                    continue;
                }
                if (Option?.UseDeepQuery) {
                    let QueryNodes = Queryer.Query(Info.DomPaths, {
                        Mode: 'DeepMulti',
                    });
                    Info.Nodes = QueryNodes;
                }
                let TargetDom = Option?.UseDeepQuery ? Info.Nodes : Info.DomPaths;
                let TargetPath = [];
                let TargetValue;
                if (typeof (Info.StoreValue) != 'function') {
                    if (Option?.UseTreePath)
                        TargetPath = [...Info.TreePaths];
                    if (Option?.UseDomStore || Info.StoreValue == '.')
                        TargetPath.push(Info.DomName);
                    else if (Info.StoreValue != null && Info.StoreValue != '')
                        TargetPath = this.Paths(TargetPath, Info.StoreValue);
                }
                TargetValue = TargetPath.length > 0 ? TargetPath : Info.StoreValue;
                ActionSet(Info, {
                    TargetDom: TargetDom,
                    TargetPath: TargetPath,
                    TargetValue: TargetValue,
                });
            }
            return this;
        }
        $ParseTreeSet(Paths, TreeSet, Result) {
            let AllKeys = Object.keys(TreeSet);
            for (let i = 0; i < AllKeys.length; i++) {
                let Command = AllKeys[i];
                let SetPair = TreeSet[Command];
                let DomPaths = [...Paths];
                let TreePaths = [...Paths];
                let DomName = TreePaths.pop();
                if (!Command.includes(':')) {
                    Result.push({
                        Command: Command,
                        StoreValue: SetPair,
                        TreePaths: TreePaths,
                        DomPaths: DomPaths,
                        DomName: DomName,
                    });
                    continue;
                }
                let Commands = Command.split(':');
                if (Command.length < 2) {
                    Model.$Error(`command ${Command} invalid`);
                    continue;
                }
                Command = Commands.shift();
                let NextDomName = Model.ToJoin(Commands, ':');
                if (Command == '') {
                    this.$ParseTreeSet([...Paths, NextDomName], SetPair, Result);
                    continue;
                }
                Result.push({
                    Command: Command,
                    CommandKey: NextDomName,
                    StoreValue: SetPair,
                    TreePaths: TreePaths,
                    DomPaths: DomPaths,
                    DomName: DomName,
                });
            }
        }
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
        $ConvertCommandOption(DomName, Option) {
            if (Option == null) {
                if (this.IsPathType(DomName))
                    return { Target: DomName, FuncAction: false };
                else {
                    let Nodes = DomName;
                    let NodeNames = Nodes.map(Item => Item.DomName);
                    return { Target: NodeNames, FuncAction: false };
                }
            }
            if (typeof Option == 'string' || typeof Option == 'function' || Array.isArray(Option))
                return { Target: Option, FuncAction: true };
            Option.FuncAction ??= true;
            return Option;
        }
        $AddCommand(DomName, Command, Option) {
            if (DomName == null)
                return;
            if (!Array.isArray(DomName))
                DomName = [DomName];
            let IsFromQueryNode = DomName[0] instanceof QueryNode;
            let QueryNodes;
            if (IsFromQueryNode)
                QueryNodes = DomName;
            else
                QueryNodes = Queryer.Query(DomName);
            let Target = Option.Target;
            if (typeof (Target) == 'function') {
                let FuncDomName = DomName;
                Target = this.$GenerateEventFunction(FuncDomName, Target, Command);
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
            for (let i = 0; i < QueryNodes.length; i++) {
                let NodeItem = QueryNodes[i];
                let Dom = NodeItem.Dom;
                this.$SetAttribute(Dom, Command, Target);
            }
        }
        $SetAttribute(Dom, AttrName, AttrValue) {
            if (Dom == null) {
                let Message = `Dom Element is null. ${AttrValue}`;
                console.warn(Message);
                return;
            }
            Dom.setAttribute(AttrName, AttrValue);
        }
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
    class VueModel extends VueCommand {
        $MountId = null;
        Id;
        constructor() {
            super();
            this.Id = this.GenerateId();
            this.$MountId = 'app';
        }
        WithMountId(MountId) {
            this.$MountId = MountId;
            return this;
        }
        Init() {
            if (this.$IsInited)
                return this;
            this.Store = (0, vue_1.reactive)(this.Store);
            let GetStore = this.Store;
            let MountedFunc = this.$MountedFuncs;
            this.$VueApp = (0, vue_1.createApp)({
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
    exports.VueModel = VueModel;
    const Model = new VueModel();
    exports.Model = Model;
    window.Model = Model;
});
//# sourceMappingURL=VueModel.js.map