export type PathType = string | string[] | PathType[];
export declare class FuncBase {
    protected $NavigateToFunc: (Url: string) => {};
    protected $DefaultDateJoinChar: string;
    constructor();
    WithNavigateTo(NavigateToFunc: (Url: string) => {}): this;
    WithDateTextJoinChar(JoinChar: string): this;
    GenerateId(): string;
    GenerateIdReplace(FillString: string): string;
    GenerateUrl(Url: PathType, UrlParam?: string | Record<string, any>): string;
    protected $BaseNavigateTo(Url: string): void;
    NavigateToRoot(): this;
    NavigateTo(Url: PathType, UrlParam?: string | Record<string, any>): this;
    protected $BaseNavigateBlank(Url: string): void;
    NavigateBlank(Url: PathType, UrlParam?: string | Record<string, any>): this;
    ForEachObject<TValue>(Param: Record<string, TValue>, Func: (Key: string, Value: TValue) => void): void;
    DeepObjectExtend(Target: any, Source: any, MaxDepth?: number): any;
    ToDateInfo(QueryDate?: Date | string | DateTimeInfo): DateTimeInfo;
    ToDateText(QueryDate?: Date | string | DateTimeInfo, Option?: DateTextOption | string): string;
    ToDateTimeText(QueryDate?: Date | string | DateTimeInfo, Option?: DateTimeTextOption | string): string;
    protected $CreateDateInfo(DateOrText: Date | string | DateTimeInfo): DateTimeInfo;
    ConvertTo_UrlQuery(Param: string | Record<string, any>): string;
    ClearUrl(ApiUrl: string): string;
    ToJoin(Value: any, Separator?: string): string;
    Paths<T = any>(...Value: any[]): T[];
    IsPathType(CheckPathType: any): boolean;
    protected $Throw(Message: string): void;
    protected $Error(Data: any): void;
}
type QueryModeType = 'Multi' | 'DeepMulti';
type QueryOption = {
    Mode: QueryModeType;
    TargetNode?: QueryNode;
};
export declare class QueryNode extends FuncBase {
    Dom: HTMLElement;
    DomName: string;
    Parent: QueryNode;
    Children: QueryNode[];
    ElementDeep: number;
    NodeDeep: number;
    constructor(Dom: HTMLElement);
    Query(DomName: PathType, Option?: QueryOption): QueryNode[];
    QueryCss(Selector: string, Option?: QueryOption): QueryNode[];
    Selector(Selector: string): Element;
    SelectorAll(Selector: string): NodeListOf<Element>;
    protected $RCS_QueryChildrens(TargetNode: QueryNode, DomName: PathType, Option: QueryOption): QueryNode[];
    protected $RCS_QueryCssChildrens(TargetNode: QueryNode, Selector: string, Option: QueryOption): QueryNode[];
}
export declare class DomQueryer {
    $Root: HTMLElement;
    $RootNode: QueryNode;
    $Nodes: QueryNode[];
    $QueryDomName: string;
    IsInited: boolean;
    WithRoot(Filter: string): this;
    WithDomName(QueryDomName: string): this;
    Init(IsReInited?: boolean): this;
    Query(DomName: PathType, Option?: QueryOption | QueryNode): QueryNode[];
    QueryCss(Selector: string, Option?: QueryOption | QueryNode): QueryNode[];
    Using(DomName: PathType, UsingFunc: (Prop: {
        QueryNodes: QueryNode[];
    }) => void, TargetNode?: QueryNode): this;
    protected $RCS_Visit(DomNode: HTMLElement, Parent: QueryNode, ElementDeep: number): void;
    protected $AddNode(Dom: HTMLElement, Parent: QueryNode, ElementDeep: number): QueryNode;
}
export declare var Queryer: DomQueryer;
export type DateTimeInfo = {
    Date: Date;
    Year: number;
    Month: number;
    Day: number;
    Hour: number;
    Minute: number;
    Second: number;
};
type DateTextOption = {
    DateJoinChar?: string;
    Format?: string;
};
type DateTimeTextOption = DateTextOption & {};
export type ApiCallback = {
    OnCalling?: Function;
    OnSuccess?: Function;
    OnError?: Function;
    OnComplete?: Function;
};
type FileItemStore = {
    FileId?: string;
    File?: File;
    Base64?: string;
    Buffer?: ArrayBuffer;
    ConvertType?: FileConvertType | FileConvertType[];
};
export declare class FileItem {
    OnChangeBase64: Function;
    OnChangeBuffer: Function;
    protected $Store: FileItemStore;
    constructor(File?: File, ConvertType?: FileConvertType | FileConvertType[]);
    get FileId(): string;
    set FileId(Value: string);
    get File(): File;
    set File(Value: File);
    get ConvertType(): FileConvertType | FileConvertType[];
    set ConvertType(Value: FileConvertType | FileConvertType[]);
    get Base64(): string;
    set Base64(Value: string);
    get Buffer(): ArrayBuffer;
    set Buffer(Value: ArrayBuffer);
    get InnerStore(): FileItemStore;
    Clear(): void;
    From(Item: FileItem): void;
    protected $ConvertFile(): void;
    protected $ConvertBase64(IsForce?: boolean): this;
    protected $ConvertBuffer(): void;
}
type FileConvertType = 'none' | 'base64' | 'buffer';
type FilesType = File | File[] | FileItem | FileItem[];
type FormDataFileType = FilesType | Record<string, File> | Record<string, FileItem> | Record<string, File[]> | Record<string, FileItem[]>;
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type ApiCallQuery = string | object;
type ApiCallBody = Record<string, any>;
type ApiCallFile = FormDataFileType;
type AddApiContent = {
    Url: string;
    Method: HttpMethod;
    Query?: ApiCallQuery | (() => ApiCallQuery);
    Body?: ApiCallBody | (() => ApiCallBody);
    File?: ApiCallFile | (() => ApiCallFile);
    Export?: boolean | ((ApiResult: any, ApiResponse: Response) => any);
    IsUpdateStore?: boolean;
} & ApiCallback;
type ApiStoreValue = {
    ApiKey: string;
    IsCalling?: boolean;
    IsComplete?: boolean;
    IsError?: boolean;
    IsSuccess?: boolean;
} & AddApiContent;
type ApiCallOption = {
    Query?: ApiCallQuery | (() => ApiCallQuery);
    Body?: ApiCallBody | (() => ApiCallBody);
    File?: ApiCallFile | (() => ApiCallFile);
    IsUpdateStore?: boolean;
} & ApiCallback;
type FileStoreType = Record<string, FileItem[] | FileItem>;
type StoreType = Record<string, any> & {
    FileStore: FileStoreType;
};
type GetStoreOption<TStore = any> = {
    CreateIfNull?: boolean;
    DefaultValue?: TStore;
    Clone?: boolean;
};
type ClearStoreOption = {
    DeepClear?: boolean;
};
type EventArg_AddApi = ApiStoreValue;
type EventArg_UpdateStore = {
    Path: string;
    Data: any;
};
type EventArg_AddStore = EventArg_UpdateStore;
type EventArg_SetStore = EventArg_UpdateStore;
type AddPropertyType = {
    Value?: any;
    Bind?: Array<any>;
    Target?: PathType;
} & PropertyDescriptor;
type AddFileStoreOption = {
    Multi?: boolean;
};
export type AddSubApiNotifyArg = {
    ApiStore: ApiStoreValue;
    PropertyName: string;
    Value: any;
};
export type AddSubApiNotify = ((Arg: AddSubApiNotifyArg) => void);
export type AddSubApiOption = {
    PropertyName?: string;
    NotifyEvent: AddSubApiNotify;
};
export type AddSubApiStore = AddSubApiOption;
export declare class ApiStore extends FuncBase {
    #private;
    constructor();
    get ApiDomain(): string;
    set ApiDomain(ApiDomain: string);
    get OnEventName(): {
        ApiStore: {
            AddApi: string;
            UpdateStore: string;
            AddStore: string;
            SetStore: string;
        };
    };
    get Store(): StoreType;
    protected set Store(Store: StoreType);
    get ApiStore(): any;
    get FileStore(): FileStoreType;
    WithAccessToken(AccessToken: string): this;
    WithRefreshToken(RefreshToken: string): this;
    WithApiDomain(ApiDomain: string): this;
    WithRootRoute(Route: string): this;
    WithHeader(Func: (Headers: Headers) => void): this;
    WithOnSuccess(SuccessFunc: (Result: any, Reponse: Response) => void): this;
    WithOnError(ErrorFunc: (Exception: any) => void): this;
    WithOnComplete(CompleteFunc: (Result: any, Reponse: Response) => void): this;
    WithExportSuccessStore(ExportSuccessStoreFunc: (Result: any, Reponse: Response) => any): this;
    WithConvertTo_FormParam(ConvertToFunc: (ConvertData: object, Form: FormData) => object): this;
    ClearConvertTo_FormParam(): this;
    ConvertTo_ApiUrl(Url: string, Param?: string | object): string;
    AddApi(AddApi: Record<string, AddApiContent>): this;
    ApiCall(ApiKey: string, Option?: ApiCallOption): this;
    ApiCall_Form(ApiKey: string, Option?: ApiCallOption): this;
    protected $BaseApiCall(ApiKey: string, Option: ApiCallOption, IsFormRequest: boolean): void;
    protected $GenerateFetchRequest(Api: ApiStoreValue, ParamBody: ApiCallBody, ParamFile: ApiCallFile, IsFormRequest: boolean): RequestInit;
    AddSubApi(ApiKey: string, Option: AddSubApiOption | AddSubApiNotify): this;
    PubApi(ApiKey: string, PropertyName: string, Value: any): this;
    UseFormJsonBody(JsonBodyKey?: string): this;
    EventAdd_AddApi(EventFunc: (EventArg: EventArg_AddApi) => void): this;
    EventAdd_UpdateStore(EventFunc: (EventArg: EventArg_UpdateStore) => void): this;
    EventAdd_AddStore(EventFunc: (EventArg: EventArg_AddStore) => void): this;
    EventAdd_SetStore(EventFunc: (EventArg: EventArg_SetStore) => void): this;
    protected $EventAdd<EventArgType>(EventName: string, OnFunc: (EventArg: EventArgType) => void): void;
    protected $EventTrigger<EventArgType>(EventName: string, EventArg: EventArgType): void;
    GetStore<TStore = any>(StorePath: PathType, Option?: GetStoreOption<TStore> | boolean): TStore;
    AddStore<TStore = any>(StorePath: PathType, StoreData?: TStore): this;
    SetStore<TStore = any>(StorePath: PathType, StoreData: TStore): this;
    UpdateStore<TStore = any>(StorePath: PathType, StoreData: TStore): this;
    ClearStore(StorePath: PathType, Option?: boolean | ClearStoreOption): this;
    GetStoreFrom<TStore = any>(SourceStore: any, StorePath: PathType, Option?: GetStoreOption<TStore> | boolean): TStore;
    AddStoreFrom<TStore = any>(SourceStore: any, StorePath: PathType, StoreData?: TStore): this;
    SetStoreFrom<TStore = any>(SourceStore: any, StorePath: PathType, StoreData: TStore): this;
    UpdateStoreFrom<TStore = any>(SourceStore: any, StorePath: PathType, StoreData: TStore): this;
    ClearStoreFrom(SourceStore: any, StorePath?: PathType, Option?: boolean | ClearStoreOption): this;
    protected $RCS_GetStore(StorePath: string, FindStore: any, Option: {
        CreateIfNull: boolean;
        DefaultValue: object;
    }): any;
    protected $RCS_SetStore(StorePath: string, StoreData: any, FindStore: any, Option?: {
        IsDeepSet: boolean;
    }): any;
    protected $RCS_ClearStore(TargetStore: any, Option: ClearStoreOption): void;
    protected $DeepSetObject(SetData: Record<string, any>, FindStore: any): void;
    AddFileStore(FileStoreKey: string, Option?: AddFileStoreOption): this;
    Files(FileStoreKey: string, WhereFunc?: (FileArg: FileItem) => boolean): File[];
    File(FileStoreKey: string, WhereFunc?: (FileArg: FileItem) => boolean): File;
    AddFile(FileStoreKey: string, AddFile: FilesType, ConvertType?: FileConvertType | FileConvertType[]): this;
    RemoveFile(FileStoreKey: string, DeleteFileId: string | string[]): this;
    ClearFile(FileStoreKey: string): this;
    protected $ProcessApiReturn(ApiResponse: Response): Promise<any>;
    NavigateToRoot(): this;
    protected $ConvertTo_FormData(ConvertFormData: FormData | Record<string, any>, Form: FormData): FormData;
    protected $ConvertTo_FormFile(FileParam: FormDataFileType, Form: FormData): FormData;
    protected $AppendFileToFormData(FileKey: string, Form: FormData, FileData: FilesType): FormData;
}
import { App, Plugin, Directive } from 'vue';
import { WatchCallback, WatchOptions, WatchHandle } from 'vue';
export declare class VueStore extends ApiStore {
    #private;
    protected $VueProxy: any;
    protected $VueOption: Record<string, any>;
    protected $VueApp: App;
    protected $VueUse: Plugin[];
    protected $CoreStore: string;
    protected $MountedFuncs: Function[];
    protected $Directive: {
        Name: string;
        Directive: Directive;
    }[];
    constructor();
    get Store(): StoreType;
    protected set Store(Store: StoreType);
    WithVueOption(VueOption?: {}): this;
    WithMounted(MountedFunc?: () => void): this;
    WithComponent(Component?: {}): this;
    WithVueUse(...UsePlugin: Plugin[]): this;
    WithDirective(Name: string, Directive: Directive): this;
    ForceUpdate(): this;
    Refs(RefName: PathType): any;
}
type UsingFunctionType = ((Paths: PathType, Node?: QueryNode[]) => void);
type CommandOption = {
    CommandKey?: string;
    Target: PathType | Function;
    TargetHead?: PathType;
    TargetTail?: PathType;
    FuncAction?: boolean;
    FuncArgs?: PathType;
};
type TreeSetType = {
    'v-text'?: '' | PathType | Function | TreeSetOption;
    'v-model'?: '' | PathType;
    'v-for'?: '' | PathType | Function | TreeSetOption;
    'v-if'?: '' | PathType | Function | TreeSetOption;
    'v-else'?: '' | null;
    'v-else-if'?: '' | PathType | Function | TreeSetOption;
    'v-show'?: '' | PathType | Function | TreeSetOption;
    'v-bind'?: '' | PathType | Function | TreeSetOption;
    'v-on:change'?: '' | PathType | Function | TreeSetOption;
    'v-on:click'?: '' | PathType | Function | TreeSetOption;
    'v-on-mounted'?: '' | PathType | Function | TreeSetOption;
    'v-on-unmounted'?: '' | PathType | Function | TreeSetOption;
    'watch'?: '' | WatchCallback;
    'using'?: '' | UsingFunctionType;
    [VModelCmd: `v-model:${string}`]: '' | PathType | TreeSetOption;
    [VForCmd: `v-for(${string})`]: '' | PathType | Function | TreeSetOption;
    [VBindCmd: `v-bind:${string}`]: '' | PathType | Function | TreeSetOption;
    [VOnCmd: `v-on:${string}`]: '' | PathType | Function | TreeSetOption;
    [VOnParamCmd: `v-on:${string}(${string})`]: '' | PathType | Function | TreeSetOption;
    [VSlotCmd: `v-slot:${string}`]: '' | string;
    [VOnMountedCmd: `v-on-mounted(${string})`]: '' | PathType | Function | TreeSetOption;
    [VOnUnMountedCmd: `v-on-unmounted(${string})`]: '' | PathType | Function | TreeSetOption;
    [FuncCmd: `func:${string}`]: '' | Function;
    [DomName: `:${string}`]: '' | UsingFunctionType | TreeSetType;
};
type TreeSetOption = CommandOption;
type AddCommandOption = PathType | Function | CommandOption;
type AddV_ModelOption = {
    ModelValue?: string;
    DefaultValue?: any;
};
type AddV_FilePickerOption = string | {
    Store: string;
    Accept?: string | string[];
    Multiple?: boolean;
    ConvertType?: FileConvertType | FileConvertType[];
};
type AddV_TreeOption = {
    UseDeepQuery?: boolean;
    UseTreePath?: boolean;
    UseDomStore?: boolean;
};
export declare class VueCommand extends VueStore {
    protected $IsInited: boolean;
    $QueryDomName: string;
    WithQueryDomName(QueryDomName: string): this;
    AddV_Text(DomName: PathType | QueryNode[], Option: AddCommandOption): this;
    AddV_Model(DomName: PathType | QueryNode[], StorePath: PathType, Option?: AddV_ModelOption): this;
    AddV_Slot(DomName: PathType | QueryNode[], SlotKey: string, StorePath: PathType): this;
    AddV_For(DomName: PathType | QueryNode[], Option?: AddCommandOption, ForKey?: PathType): this;
    AddV_If(DomName: PathType | QueryNode[], Option: AddCommandOption): this;
    AddV_ElseIf(DomName: PathType | QueryNode[], Option: AddCommandOption): this;
    AddV_Else(DomName: PathType | QueryNode[]): this;
    AddV_Show(DomName: PathType | QueryNode[], Option: AddCommandOption): this;
    AddV_Bind(DomName: PathType | QueryNode[], BindKey: string, Option: AddCommandOption, Args?: string): this;
    AddV_On(DomName: PathType | QueryNode[], EventName: string, Option: AddCommandOption, Args?: string): this;
    Watch(WatchPath: PathType | (() => any), Callback: WatchCallback, Option?: WatchOptions): WatchHandle;
    AddV_Watch(WatchPath: PathType | (() => any), Callback: WatchCallback, Option?: WatchOptions): this;
    AddV_Function(FuncName: PathType, Func: Function): this;
    AddV_OnChange(DomName: PathType | QueryNode[], ChangeFunc: AddCommandOption, Args?: string): this;
    AddV_Click(DomName: PathType | QueryNode[], Option: AddCommandOption, Args?: string): this;
    AddV_FilePicker(DomName: PathType | QueryNode[], Option: AddV_FilePickerOption): this;
    AddV_Tree(TreeRoot: PathType | QueryNode, TreeSet: TreeSetType, Option?: AddV_TreeOption): this;
    private $ParseTreeSet;
    AddV_Property(PropertyPath: PathType, Option: AddPropertyType): this;
    AddV_PropertyFrom(SourceStore: any, PropertyPath: PathType, Option: AddPropertyType): this;
    protected $BaseAddProperty(PropertyStore: StoreType, PropertyKey: string, Option: AddPropertyType): StoreType;
    protected $ConvertCommandOption(DomName: PathType | QueryNode[], Option?: AddCommandOption): CommandOption;
    protected $AddCommand(DomName: PathType | QueryNode[], Command: string, Option: CommandOption): void;
    protected $SetAttribute(Dom: HTMLElement, AttrName: string, AttrValue: string): void;
    protected $RandomFuncName(BaseFuncName: string): string;
    protected $GenerateEventFunction(DomName: PathType, EventFunc: Function, Command: string): string;
}
export declare class VueModel extends VueCommand {
    $NativeWarn: (...Message: any[]) => void;
    $IsEnableVueWarn: boolean;
    $MountId: string;
    Id: string;
    constructor();
    WithMountId(MountId: string): this;
    WithVueWarn(Enable: boolean): this;
    WithLifeCycleDirective(): void;
    Init(): this;
    Using(UseFunc?: () => void): this;
    UsingVueApp(UsingFunc: ((VueApp: App) => void)): this;
    AddV_OnMounted(DomName: PathType | QueryNode[], Option: AddCommandOption, Args?: string): this;
    AddV_OnUnMounted(DomName: PathType | QueryNode[], Option: AddCommandOption, Args?: string): this;
}
declare const Model: VueModel;
export { Model, };
