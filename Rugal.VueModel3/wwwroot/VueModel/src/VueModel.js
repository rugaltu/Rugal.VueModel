/**
 *  VueModel.js v3.4.4
 *  From Rugal Tu
 * */

VerifyVueJs();

const { createApp, reactive } = Vue;
const Dom = new DomEditor();
class VueModel extends CommonFunc {
    constructor() {
        super();

        this.IsInited = false;
        this.$Store = {
            FileStore: {},
        };
        this.BindElementId = 'BindApp';
        this.DefaultStoreKey = 'Default';
        this.DefaultQueryAttribute = 'vc-col';
        this.WithDefaultStoreKey(this.DefaultStoreKey);

        this.VueOption = {
            methods: {},
            components: {},
            watch: {},
            computed: {},
        };
        this.VueProxy = null;
        this.Vue = null;
        this.VueUse = [];
        this.MountedFuncs = [];

        this.ApiStore = {}
        this.$ApiDomain = null;
        this.ApiToken = null;

        this.FuncKey_FormatDate = 'Format_Date';
        this._Func_ConvertTo_FormData = [];
        this.FileExtensionCheckOption = {
            IsCheck: false,
            IsAlert: false,
            ErrorMessage: 'Error file extension',
        };
    }

    //#region Get/Set Property
    get Function() {
        let Result = this.VueProxy?.$options?.methods ?? this.VueOption.methods;
        return Result;
    }
    get Dom() {
        return new DomEditor();
    }
    get ApiDomain() {
        if (this.$ApiDomain == null)
            return null;
        return this._ClearUrl(this.$ApiDomain);
    }
    set ApiDomain(ApiDomain) {
        this.$ApiDomain = this._ClearUrl(ApiDomain);
    }
    get FileStore() {
        return this.Store.FileStore;
    }
    get Store() {
        let GetStore = this.VueProxy;
        GetStore ??= this.$Store;
        return GetStore;
    }
    //#endregion

    //#region Public Init Method
    Init() {
        if (this.IsInited)
            return this;

        this.$Store = reactive(this.$Store);
        let GetStore = this.$Store;
        let MountedFunc = this.MountedFuncs;
        let SetVueOption = {
            ...this.VueOption,
            data() {
                return GetStore;
            },
            mounted: () => {
                for (let Func of MountedFunc)
                    Func();
            }
        };
        this.Vue = createApp(SetVueOption);
        for (let Item of this.VueUse) {
            this.Vue.use(Item);
        }
        this.VueProxy = this.Vue.mount(`#${this.BindElementId}`);
        this.IsInited = true;
        return this;
    }
    Using(UseFunc = () => { }) {
        UseFunc();
        return this;
    }
    //#endregion

    //#region VueModel Option
    WithDefaultStoreKey(_DefaultStoreKey) {
        this.DefaultStoreKey = _DefaultStoreKey;
        this.Store[this.DefaultStoreKey] ??= {};
        return this;
    }
    WithDefaultStore(_Store) {
        this.$Store = this._DeepObjectExtend(this.$Store, _Store);
        return this;
    }
    WithRootId(_BindElementId = 'BindApp') {
        this.BindElementId = _BindElementId;
        return this;
    }
    WithApiDomain(ApiDomain) {
        this.ApiDomain = ApiDomain;
        return this;
    }
    WithApiToken(ApiToken) {
        this.ApiToken = ApiToken;
        return this;
    }
    WithQueryAttribute(AttributeName) {
        this.DefaultQueryAttribute = AttributeName;
        return this;
    }
    //#endregion

    //#region With Vue Option
    WithVueOption(_VueOption = {}) {
        this.VueOption = this._DeepObjectExtend(this.VueOption, _VueOption);
        return this;
    }
    WithMounted(MountedFunc = () => { }) {
        this.MountedFuncs.push(MountedFunc);
        return this;
    }
    WithComponent(Component = {}) {
        this.VueOption.components = this._DeepObjectExtend(this.VueOption.components, Component);
        return this;
    }
    WithVueUse(...UsePackage) {
        for (let Item of UsePackage) {
            this.VueUse.push(Item);
        }
        return this;
    }
    //#endregion

    //#region With Process Function
    WithConvertTo_FormParam(ConvertToFunc = (FormData, Form) => { }) {
        this._Func_ConvertTo_FormData.push(ConvertToFunc);
        return this;
    }
    WithFormDataJsonBody(JsonBodyKey = 'Body') {
        this.WithConvertTo_FormParam((FormDataBody, Form) => {
            let ConvertParam = {};
            ConvertParam[JsonBodyKey] = JSON.stringify(FormDataBody);
            return ConvertParam;
        });
        return this;
    }
    WithFileExtensionCheck(Option = { IsAlert: false, ErrorMessage: null }) {
        this.FileExtensionCheckOption.IsCheck = true;
        this.FileExtensionCheckOption.IsAlert = Option.IsAlert;
        if (!this._IsNullOrEmpty(Option.ErrorMessage))
            this.FileExtensionCheckOption.ErrorMessage = Option.ErrorMessage;
        return this;
    }
    //#endregion

    //#region Add Vue Option
    AddV_Function(FuncKey, Func) {
        this.VueOption.methods[FuncKey] = Func;
        return this;
    }
    AddProperty(PropertyPath, Option = {
        Value: null,
        Target: null,
        Bind: [],
        get: null,
        set: null,
    }) {
        let SetStore = this.Store;
        let PropertyKey = PropertyPath;
        if (PropertyPath.includes('.')) {
            let PropertyPaths = PropertyPath.split('.');
            PropertyKey = PropertyPaths.pop();
            let FindPath = PropertyPaths.join('.');
            SetStore = this.GetStore(FindPath, {
                CreateIfNull: true
            });
        }
        let SetProperty = this._BaseAddProperty(SetStore, PropertyKey, Option);
        if (Option.Bind) {
            if (!Array.isArray(Option.Bind))
                Option.Bind = [Option.Bind];

            for (let BindPath of Option.Bind) {
                this.AddProperty(BindPath, {
                    Target: PropertyPath,
                });
            }
            SetProperty['Bind'] = Option.Bind;
        }
        return this;
    }
    _BaseAddProperty(PropertyStore, PropertyKey, Option = {
        Target: null,
        Value: null,
        get: null,
        set: null,
    }) {
        let ThisModel = this;

        let PropertyContent = {
            get() {
                if (Option.Target == null)
                    return this[`$${PropertyKey}`];

                return ThisModel.GetStore(Option.Target);
            },
            set(Value) {
                if (Option.Target == null)
                    this[`$${PropertyKey}`] = Value;
                else
                    ThisModel.SetStore(Option.Target, Value);
            }
        };

        let HasGet = true;
        let HasSet = true;
        if (Option.get || Option.set) {
            HasGet = Option.get != null;
            HasSet = Option.set != null;
            PropertyContent = {};
            if (HasGet)
                PropertyContent.get = Option.get;
            if (HasSet)
                PropertyContent.set = Option.set;
        }
        let SetProperty = Object.defineProperty(PropertyStore, PropertyKey, PropertyContent);
        if (Option.Value != null && HasSet)
            SetProperty[PropertyKey] = Option.Value;

        return SetProperty;
    }
    //#endregion

    //#region Add Vue Command
    //#region v-text
    AddV_Text(DomName, StoreKey = null) {
        StoreKey ??= this._ReCombineStoreKey(DomName);
        this._BaseAddVdom_Text(
            this.Dom.WithAttr(this.DefaultQueryAttribute, DomName),
            StoreKey);
        return this;
    }
    _BaseAddVdom_Text(Dom, StoreKey) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        this.AddStore(StoreKey, null);
        GetDom.SetAttr('v-text', StoreKey);
        return this;
    }
    //#endregion

    //#region v-model
    AddV_Model(ColName, StoreKey = null, Option = { VModelKey: null }) {
        this.AddVdom_Model(
            this.Dom.WithAttr(this.DefaultQueryAttribute, ColName),
            StoreKey,
            Option
        );
        return this;
    }
    AddVdom_Model(Dom, StoreKey, Option = { VModelKey: null }) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        StoreKey ??= this._ReCombineStoreKey(StoreKey);
        this.AddStore(StoreKey, null);
        GetDom.ForEach(Item => {
            let VModelCommand = 'v-model';
            if (!this._IsNullOrEmpty(Option.VModelKey))
                VModelCommand += `:${Option.VModelKey}`;

            GetDom.SetElement_Attr(Item, VModelCommand, StoreKey);
        });
        return this;
    }
    //#endregion

    //#region v-for
    AddV_For(ColName, StoreKey, ForKey = null) {
        this.AddVdom_For(
            this.Dom.WithAttr(this.DefaultQueryAttribute, ColName),
            StoreKey,
            ForKey
        );
        return this;
    }
    AddVdom_For(Dom, StoreKey, ForKey = null) {
        let GetStore = this.GetStore(StoreKey);
        if (GetStore == null)
            this.AddStore(StoreKey, []);
        else if (!Array.isArray(GetStore))
            this.UpdateStore(StoreKey, []);

        ForKey ??= '(Item, Idx)';
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr('v-for', `${ForKey} in ${StoreKey}`);
        return this;
    }
    //#endregion

    //#region Input-File
    AddV_File(ColName, FileStoreKey = null, Option = { IsAddMode: false, ConverFileFunc: null }) {
        this.AddVdom_File(this.Dom.WithAttr(this.DefaultQueryAttribute, ColName), FileStoreKey ?? ColName, Option);
        return this;
    }
    AddVdom_File(Dom, FileStoreKey, Option = { IsAddMode: false, ConverFileFunc: null }) {
        this.AddFileStore(FileStoreKey);
        let { IsAddMode, ConverFileFunc } = Option;

        this.AddVdom_OnChange(Dom, Arg => {
            if (this.FileExtensionCheckOption.IsCheck)
                this._CheckFileExtension(Arg);

            if (!IsAddMode)
                this.FileStore[FileStoreKey] = [];
            else
                Arg.target.value = '';

            let Files = [...Arg.target.files];
            let AddFiles = Files.map(Item => {

                let ConvertFile = {
                    FileId: this._GenerateId(),
                    File: Item,
                };
                if (ConverFileFunc != null)
                    ConverFileFunc(Item, ConvertFile);

                return ConvertFile;
            });

            this.FileStore[FileStoreKey].push(...AddFiles);
            this.ForceUpdate();
        });
        return this;
    }
    //#endregion

    //#region v-if
    AddV_If(ColName, IfValue) {
        this.AddVdom_If(this.Dom.WithAttr(this.DefaultQueryAttribute, ColName), IfValue);
        return this;
    }
    AddVdom_If(Dom, IfValue) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr('v-if', IfValue);
        return this;
    }
    //#endregion

    //#region v-show
    AddV_Show(ColName, ShowValue) {
        this.AddVdom_Show(this.Dom.WithAttr(this.DefaultQueryAttribute, ColName), ShowValue);
        return this;
    }
    AddVdom_Show(Dom, ShowValue) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr('v-show', ShowValue);
        return this;
    }
    //#endregion

    //#region v-bind:formatter
    AddV_Format(ColName, FuncKey, ...Params) {
        this.AddVdom_Format(this.Dom.WithAttr(this.DefaultQueryAttribute), FuncKey, Params ?? ColName);
        return this;
    }
    AddVdom_Format(_Dom, FuncKey, ...Params) {
        Params = Params.join(',');
        let GetDom = this._BaseCheck_DomEditor(_Dom);
        GetDom.SetAttr(':formatter', `${FuncKey}(${Params})`);
        return this;
    }
    //#endregion

    //#region v-on:change
    AddV_OnChange(ColName, ChangeFunc, FuncParam = null) {
        this.AddVdom_OnChange(this.Dom.WithAttr(this.DefaultQueryAttribute, ColName), ChangeFunc, FuncParam);
        return this;
    }
    AddVdom_OnChange(Dom, ChangeFunc, FuncParam = null) {
        this.AddVdom_On(Dom, 'change', ChangeFunc, FuncParam);
        return this;
    }
    //#endregion

    //#region v-on
    AddV_On(ColName, EventKey, EventFunc, FuncParam = null) {
        this.AddVdom_On(this.Dom.WithAttr(this.DefaultQueryAttribute, ColName), EventKey, EventFunc, FuncParam);
        return this;
    }
    AddVdom_On(Dom, EventKey, EventFunc, FuncParam = null) {
        if (EventFunc == null)
            this._Throw(`Event「${EventKey}」function cannot be null`);

        let GetDom = this._BaseCheck_DomEditor(Dom);

        let FuncName = EventFunc;
        if (typeof EventFunc === 'function') {
            FuncName = this._GetRandomFuncName('Func');
            this.AddV_Function(FuncName, EventFunc);
        }

        let SetFuncKey = FuncName;
        if (FuncParam != null)
            SetFuncKey = `${SetFuncKey}(${FuncParam})`;

        GetDom.SetAttr(`v-on:${EventKey}`, SetFuncKey);
        return this;
    }
    //#endregion

    //#region v-bind
    AddV_Bind(ColName, BindKey, BindValue) {
        this.AddVdom_Bind(this.Dom.WithAttr(this.DefaultQueryAttribute, ColName), BindKey, BindValue);
        return this;
    }
    AddVdom_Bind(Dom, BindKey, BindValue) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr(`v-bind:${BindKey}`, BindValue);
        return this;
    }
    //#endregion

    //#region v-on:click
    AddV_Click(ColName, ClickFunc, FuncParam = null) {
        this.AddVdom_Click(this.Dom.WithAttr(this.DefaultQueryAttribute, ColName), ClickFunc, FuncParam);
        return this;
    }
    AddVdom_Click(Dom, ClickFunc, FuncParam = null) {
        if (ClickFunc == null)
            this._Throw('Click function cannot be null');

        this.AddVdom_On(Dom, 'click', ClickFunc, FuncParam);
        return this;
    }
    //#endregion

    //#region v-slot
    AddV_Slot(ColName, SlotKey, SlotValue) {
        this.AddVdom_Slot(this.Dom.WithAttr(this.DefaultQueryAttribute, ColName), SlotKey, SlotValue);
        return this;
    }
    AddVdom_Slot(Dom, SlotKey, SlotValue) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr(`v-slot:${SlotKey}`, SlotValue);
        return this;
    }
    //#endregion

    //#region v-watch
    AddV_Watch(WatchPath, Func, Deep = false, Option = {}) {
        let SetWatch = {
            handler: Func,
            deep: Deep,
            ...Option,
        };
        this.VueOption.watch[WatchPath] = SetWatch;
        return this;
    }
    //#endregion

    //#endregion

    //#region Data Store Controller
    UpdateStoreDefault(StoreData) {
        let StoreKey = this.DefaultStoreKey;
        this.UpdateStore(StoreKey, StoreData);
        return this;
    }
    UpdateStore(StorePath, StoreData) {
        this._RCS_SetStore(StorePath, StoreData, this.Store, true);
        this.ForceUpdate();
        return this;
    }

    AddStore(StorePath, StoreData = null) {
        if (this.GetStore(StorePath) != null)
            return this;

        this._RCS_SetStore(StorePath, StoreData, this.Store, false);
        this.ForceUpdate();
        return this;
    }
    GetStore(StorePath, Option = {
        CreateIfNull: false,
        DefaultValue: {},
    }) {
        let Result = this._RCS_GetStore(StorePath, this.Store, Option);
        return Result;
    }
    SetStore(StorePath, StoreData) {
        this._RCS_SetStore(StorePath, StoreData, this.Store, false);
        this.ForceUpdate();
        return this;
    }

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
    ForceUpdate() {
        this.VueProxy?.$forceUpdate();
        return this;
    }

    _RCS_GetStore(StorePath, FindStore, Option = {
        CreateIfNull: false,
    }) {
        Option.CreateIfNull ??= false;
        if (FindStore == null)
            return null;

        let StorePaths = StorePath.split('.');
        let FirstKey = StorePaths.shift();

        if (FindStore[FirstKey] == null && Option.CreateIfNull)
            FindStore[FirstKey] = {};

        if (StorePaths.length == 0)
            return FindStore[FirstKey];

        let NextKey = StorePaths.join('.');
        return this._RCS_GetStore(NextKey, FindStore[FirstKey], Option);
    }
    _RCS_SetStore(StorePath, StoreData, FindStore, IsDeepSet = true) {
        if (StorePath.includes('.')) {
            let StorePaths = StorePath.split('.');
            let FirstKey = StorePaths.shift();
            if (FindStore[FirstKey] == null)
                FindStore[FirstKey] = {};

            let NextKey = StorePaths.join('.');
            return this._RCS_SetStore(NextKey, StoreData, FindStore[FirstKey]);
        }

        if (StoreData == null || FindStore[StorePath] == null ||
            typeof StoreData != 'object' || !IsDeepSet) {
            FindStore[StorePath] = StoreData;
            return StoreData;
        }

        this._DeepSetObject(StoreData, StorePath, FindStore);
        return StoreData;

    }
    _DeepSetObject(SetData, StorePath, FindStore) {
        if (!Array.isArray(SetData)) {
            this._ForEachKeyValue(SetData, (Key, Value) => {
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

    //#region Api Store Controller
    AddApi(ApiContent = {
        ApiKey: {
            Url,
            Param,
            Method,
            OnSuccess, OnError, OnComplete,
            IsUpdateStore,
        }
    }) {
        for (let ApiKey in ApiContent) {
            let ApiOption = ApiContent[ApiKey];
            let SetApiStore = {
                ApiKey,
                Url: ApiOption.Url,
                Method: ApiOption.Method,
                Param: ApiOption.Param,
                OnSuccess: ApiOption.OnSuccess,
                OnError: ApiOption.OnError,
                OnComplete: ApiOption.OnComplete,
                IsUpdateStore: ApiOption.IsUpdateStore ?? true,
            };
            this.ApiStore[ApiKey] = SetApiStore;
            this.AddStore(ApiKey);
        }
        return this;
    }
    ApiCall(ApiKey, Option = {
        Param: {
            Query: null,
            Body: null
        },
        OnCalling: null, OnSuccess: null, OnComplete: null, OnError: null,
        IsUpdateStore: null,
        _IsDefault: true,
    }) {

        let Api = this.ApiStore[ApiKey];
        if (Api == null)
            this._Throw(`Api setting not found of「${ApiKey}」`);

        if (Option._IsDefault == true)
            Option = {};

        let Param = Option?.Param ?? Api.Param;
        if (typeof Param === 'function')
            Param = Param();

        let Query = Param?.Query;
        let SendBody = Param?.Body;
        let IsUpdateStore = Option.IsUpdateStore ?? Api.IsUpdateStore ?? true;

        let Url = this._ConvertTo_ApiDomainUrl(Api.Url, Query);
        let FetchParam = {
            method: Api.Method,
            headers: {
                'content-type': 'application/json',
                'Authorization': this.ApiToken,
            },
        };

        if (Api.Method.toUpperCase() == 'POST')
            FetchParam['body'] = JSON.stringify(SendBody ?? {})

        Api.OnCalling?.call(this, FetchParam);
        Option.OnCalling?.call(this, FetchParam);
        fetch(Url, FetchParam)
            .then(async ApiRet => {
                if (!ApiRet.ok)
                    throw ApiRet;

                let ConvertResult = await this._ProcessApiReturn(ApiRet);
                if (IsUpdateStore) {
                    let StoreKey = Api['ApiKey'];
                    this.UpdateStore(StoreKey, ConvertResult);
                }

                Api.OnSuccess?.call(this, ConvertResult);
                Option?.OnSuccess?.call(this, ConvertResult);
                return ConvertResult;
            })
            .catch(async ex => {
                Api.OnError?.call(this, ex);
                Option?.OnError?.call(this, ex);
                this._Error(ex.message);
            })
            .then(async ConvertResult => {
                Api.OnComplete?.call(this, ConvertResult);
                Option?.OnComplete?.call(this, ConvertResult);
            });

        return this;
    }
    ApiCall_Form(ApiKey, Option = {
        Param: {
            Query: null,
            Form: null,
            File: null
        },
        OnCalling: null, OnSuccess: null, OnComplete: null, OnError: null,
        IsUpdateStore: null,
        _IsDefault: true,
    }) {
        let Api = this.ApiStore[ApiKey];
        if (Api == null)
            this._Throw(`Api setting not found of「${ApiKey}」`);

        if (Option._IsDefault == true)
            Option = {};

        let Param = Option?.Param ?? Api.Param;
        if (typeof Param === 'function')
            Param = Param();

        let Query = Param?.Query;
        let ConvertFormData = Param?.Form;

        let SendForm = null;
        let Url = this._ConvertTo_ApiDomainUrl(Api.Url, Query);
        SendForm = this._ConvertTo_FormData(ConvertFormData, SendForm);

        let FileParam = Option?.Param?.File;
        FileParam ??= Api.Param?.File;
        SendForm = this._ConvertTo_FormFile(FileParam, SendForm);

        let FetchParam = {
            method: 'POST',
            body: SendForm,
            headers: {
                'Authorization': this.ApiToken,
            },
        };

        Api.OnCalling?.call(this, FetchParam);
        Option.OnCalling?.call(this, FetchParam);
        fetch(Url, FetchParam)
            .then(async ApiResult => {
                if (!ApiResult.ok)
                    throw ApiResult;

                let ConvertResult = await this._ProcessApiReturn(ApiResult);

                Api.OnSuccess?.call(this, ConvertResult);
                Option.OnSuccess?.call(this, ConvertResult);
                return ConvertResult;
            })
            .catch(async ex => {
                Api.OnError?.call(this, ex);
                Option.OnError?.call(this, ex);
            })
            .then(async ConvertResult => {
                Api.OnComplete?.call(this, ConvertResult);
                Option.OnComplete?.call(this, ConvertResult);
            });

        return this;
    }

    _ProcessApiReturn(ApiRet) {
        let GetContentType = ApiRet.headers.get("content-type");
        let ConvertSuccess = null;
        if (GetContentType && GetContentType.includes('application/json')) {
            ConvertSuccess = ApiRet.json()
                .then(GetJson => GetJson);
        }
        else {
            ConvertSuccess = ApiRet.text()
                .then(GetText => GetText);
        }
        return ConvertSuccess;
    }
    _ConvertTo_ApiDomainUrl(Url, Param = null) {
        let ApiDomainUrl = this._ClearUrl(Url);
        if (this.ApiDomain != null && !ApiDomainUrl.includes('http'))
            ApiDomainUrl = `${this.ApiDomain}/${ApiDomainUrl}`;

        if (Param != null)
            ApiDomainUrl = `${ApiDomainUrl}?${this._ConvertTo_UrlQuery(Param)}`;

        return ApiDomainUrl;
    }
    _ConvertTo_UrlQuery(Param) {
        if (typeof Param === 'string')
            return Param;

        let AllParam = [];
        this._ForEachKeyValue(Param, (Key, Value) => {
            AllParam.push(`${Key}=${Value}`);
        });

        let QueryString = AllParam.join('&');
        return QueryString;
    }
    _ConvertTo_FormData(ConvertFormData, Form = null) {

        if (ConvertFormData == null)
            return Form;

        Form ??= new FormData();

        this._Func_ConvertTo_FormData.forEach(Func => {
            ConvertFormData = Func(ConvertFormData, Form);
        });

        if (ConvertFormData instanceof FormData)
            return ConvertFormData;

        this._ForEachKeyValue(ConvertFormData, (Key, Value) => {
            Form.append(Key, Value);
        });
        return Form;
    }
    _ConvertTo_FormFile(FileParam, Form = null) {
        if (FileParam == null)
            return Form;

        Form ??= new FormData();

        let DefaultKey = 'Files';
        if (Array.isArray(FileParam)) {
            FileParam.forEach(FileItem => {
                let GetFile = this._ExtractFileData(FileItem);
                Form.append(DefaultKey, GetFile);
            });
        }
        else if (FileParam instanceof File) {
            Form.append(DefaultKey, FileParam);
        }
        else {
            this._ForEachKeyValue(FileParam, (Key, FileData) => {
                if (Array.isArray(GetFile)) {
                    GetFile.forEach(FileItem => {
                        let GetFile = this._ExtractFileData(FileItem);
                        Form.append(Key, GetFile);
                    });
                }
                else
                    Form.append(Key, this._ExtractFileData(FileData));
            });
        }
        return Form;
    }
    //#endregion

    //#region Base Format Function
    AddBase_Format_Date() {
        this.AddV_Function(this.FuncKey_FormatDate, (DateValue, StoreKey) => {
            let SetValue = DateValue;
            if (DateValue != null) {
                SetValue = DateValue.replaceAll('/', '-').replaceAll('T', ' ');
            }
            if (DateValue != SetValue)
                this.UpdateStore(StoreKey, SetValue);
        });
        return this;
    }
    //#endregion

    //#region Base Process
    _BaseReCombineStorePath(FirstKey, Params) {
        if (!Array.isArray(Params))
            Params = [Params];

        let ParamArray = Params.filter(Item => !this._IsNullOrEmpty(Item));
        if (ParamArray.length == 0)
            this._Throw('Params cannot empty');

        if (ParamArray.length == 1) {
            let GetKey = ParamArray[0];
            if (this._IsClearSotreKey(GetKey))
                ParamArray = [FirstKey, ...ParamArray];
        }

        let BindStoreKey = ParamArray.join('.').replace(/^\.+|\.+$/g, '');
        return BindStoreKey;
    }
    _ReCombineStoreKey(Params) {
        let BindStoreKey = this._BaseReCombineStorePath(this.DefaultStoreKey, Params);
        return BindStoreKey;
    }
    _ReCombineItemKey(Params) {
        let BindStoreKey = this._BaseReCombineStorePath('Item', Params);
        return BindStoreKey;
    }
    _IsClearSotreKey(StoreKey) {
        let SkipChar = ['.', '(', ')'];
        let IsClear = SkipChar.filter(Item => StoreKey.includes(Item)).length == 0;
        return IsClear;
    }
    _BaseCheck_DomEditor(CheckDom) {
        if (CheckDom instanceof DomEditor) {
            return CheckDom;
        }
        throw new Error('error DomEditor type');
    }
    _GetRandomFuncName(FuncNameHead = '', FuncNameTail = '') {
        let RandomFuncName = this._GenerateId().replaceAll('-', '');

        FuncNameHead = FuncNameHead.replaceAll('.', '');
        if (!this._IsNullOrEmpty(FuncNameHead))
            RandomFuncName = `${FuncNameHead}_${RandomFuncName}`;

        if (!this._IsNullOrEmpty(FuncNameTail))
            RandomFuncName = `${RandomFuncName}_${FuncNameTail}`;

        return RandomFuncName;
    }
    _CheckFileExtension(Arg) {
        let Input = Arg.target;
        let Files = [...Input.files];
        let FileAccept = Input.accept;
        if (this._IsNullOrEmpty(FileAccept))
            return;

        let AcceptArray = FileAccept
            .replaceAll(' ', '')
            .split(',')
            .map(Item => Item.toLowerCase().replaceAll('.', ''));

        let IsCheck = true;
        for (let i = 0; i < Files.length; i++) {
            let GetFile = Files[i];
            let FileName = GetFile.name;
            if (!FileName.includes('.')) {
                IsCheck = false;
                break;
            }

            let GetExtension = FileName
                .split('.')
                .pop()
                .toLowerCase();

            if (!AcceptArray.includes(GetExtension)) {
                IsCheck = false;
                break;
            }
        }

        if (!IsCheck) {
            Input.value = '';

            let ErroeMessage = this.FileExtensionCheckOption.ErrorMessage;
            if (this.FileExtensionCheckOption.IsAlert)
                alert(ErroeMessage);

            this._Throw(ErroeMessage);
        }
    }
    _ExtractFileData(FileData) {
        if (FileData['File'] != null)
            return FileData['File'];

        return FileData;
    }
    //#endregion

    //#region Element Attr Control
    SetAttr(DomId, AttrName, AttrValue) {
        this.SetAttrDom(this.Dom.WithId(DomId), AttrName, AttrValue);
        return this;
    }
    SetAttrCol(ColName, AttrName, AttrValue) {
        this.SetAttrDom(this.Dom.WithAttr('vc-col', ColName), AttrName, AttrValue);
        return this;
    }
    SetAttrDom(Dom, AttrName, AttrValue) {
        let GetDom = this._BaseCheck_DomEditor(Dom);
        GetDom.SetAttr(AttrName, AttrValue);
        return this;
    }
    //#endregion
}
const Model = new VueModel()
    .AddBase_Format_Date();

function VerifyVueJs() {
    try {
        if (Vue);
    } catch (ex) {
        throw ('Vue.js is not found, should include Vue.js before include VueModel');
    }
}