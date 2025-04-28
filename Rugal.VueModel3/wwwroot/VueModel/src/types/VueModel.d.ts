type PathBase = string | string[];
export type PathType = PathBase | PathBase[];
declare class FuncBase {
    protected $NavigateToFunc: (Url: string) => {};
    protected $DefaultDateJoinChar: string;
    constructor();
    WithNavigateTo(NavigateToFunc: (Url: string) => {}): this;
    WithDateTextJoinChar(JoinChar: string): this;
    GenerateId(): string;
    GenerateIdReplace(FillString: string): string;
    protected $BaseGenerateUrl(Url: PathBase, UrlParam?: string | Record<string, any>): string;
    protected $BaseNavigateTo(Url: string): void;
    NavigateToRoot(): this;
    NavigateTo(Url: PathBase, UrlParam?: string | Record<string, any>): this;
    protected $BaseNavigateBlank(Url: string): void;
    NavigateBlank(Url: PathBase, UrlParam?: string | Record<string, any>): this;
    ForEachObject<TValue>(Param: Record<string, TValue>, Func: (Key: string, Value: TValue) => void): void;
    DeepObjectExtend(Target: any, Source: any, MaxDepth?: number): any;
    ToDateInfo(QueryDate?: Date | string | DateTimeInfo): DateTimeInfo;
    ToDateText(QueryDate?: Date | string | DateTimeInfo, Option?: DateTextOption | string): string;
    ToDateTimeText(QueryDate?: Date | string | DateTimeInfo, Option?: DateTimeTextOption | string): string;
    protected $CreateDateInfo(DateOrText: Date | string | DateTimeInfo): DateTimeInfo;
    ConvertTo_UrlQuery(Param: string | Record<string, any>): string;
    ClearUrl(ApiUrl: string): string;
    ToJoin(Value: any, Separator?: string): string;
    Paths(...Value: any[]): any[];
    protected $Throw(Message: string): void;
    protected $Error(Data: any): void;
}
declare class QueryNode extends FuncBase {
    Dom: HTMLElement;
    DomName: string;
    Parent: QueryNode;
    Children: QueryNode[];
    ElementDeep: number;
    NodeDeep: number;
    constructor(Dom: HTMLElement);
    Query(DomName: PathType): QueryNode;
    Selector(Selector: string): Element;
    SelectorAll(Selector: string): NodeListOf<Element>;
    protected $RCS_QueryChildren(TargetNode: QueryNode, DomName: PathType): QueryNode;
}
declare class DomQueryer {
    $Root: HTMLElement;
    $RootNode: QueryNode;
    $Nodes: QueryNode[];
    $QueryDomName: string;
    IsInited: boolean;
    WithRoot(Filter: string): this;
    WithDomName(QueryDomName: string): this;
    Init(IsReInited?: boolean): this;
    Query(DomName: string): QueryNode;
    Query(DomName: string, TargetNode: QueryNode): QueryNode;
    Using(DomName: PathType, UsingFunc: (Prop: {
        QueryNode: QueryNode;
        Dom: HTMLElement;
    }) => void, TargetNode?: QueryNode): this;
    protected $RCS_Visit(DomNode: HTMLElement, Parent: QueryNode, ElementDeep: number): void;
    protected $AddNode(Dom: HTMLElement, Parent: QueryNode, ElementDeep: number): QueryNode;
}
declare var Queryer: DomQueryer;
export { DomQueryer, Queryer };
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
export type TreeSetType = {
    'v-text'?: PathType | Function | TreeSetOption;
    'v-model'?: PathType;
    'v-for'?: PathType | Function | TreeSetOption;
    'v-if'?: PathType | Function | TreeSetOption;
    'v-show'?: PathType | Function | TreeSetOption;
    'v-bind'?: PathType | Function | TreeSetOption;
    'v-on:change'?: PathType | Function | TreeSetOption;
    'v-on:click'?: PathType | Function | TreeSetOption;
    'watch'?: Function;
    [VModelCmd: `v-model:${string}`]: PathType | TreeSetOption;
    [VForCmd: `v-for:${string}`]: PathType | Function | TreeSetOption;
    [VBindCmd: `v-bind:${string}`]: PathType | Function | TreeSetOption;
    [VOnCmd: `v-on:${string}`]: PathType | Function | TreeSetOption;
    [VSlotCmd: `v-slot:${string}`]: string;
    [FuncCmd: `func:${string}`]: Function;
    [DomName: `:${string}`]: TreeSetType;
};
export type TreeSetOption = CommandOption;
export type AddCommandOption = PathType | Function | CommandOption;
type CommandOption = {
    CommandKey?: string;
    Target: PathType | Function;
    TargetHead?: PathType;
    TargetTail?: PathType;
    FuncAction?: boolean;
    FuncArgs?: PathType;
};
declare class FileItem {
    FileId: string;
    File: File;
    Base64?: string;
    Buffer?: ArrayBuffer;
    ConvertType?: FileConvertType | FileConvertType[];
    constructor(FileId: string, File: File, ConvertType?: FileConvertType | FileConvertType[]);
    protected $ConvertFile(): void;
    protected $ConvertBase64(IsForce?: boolean): this;
    protected $ConvertBuffer(): void;
}
type FileConvertType = 'none' | 'base64' | 'buffer';
type FilesType = File | File[] | FileItem | FileItem[];
type FormDataFileType = FilesType | Record<string, File> | Record<string, FileItem> | Record<string, File[]> | Record<string, FileItem[]>;
type HttpMethod = 'GET' | 'POST';
type ApiCallQuery = string | object;
type ApiCallBody = Record<string, any>;
type ApiCallFile = FormDataFileType;
type AddApiContent = {
    Url: string;
    Method: HttpMethod;
    Query?: ApiCallQuery | (() => ApiCallQuery);
    Body?: ApiCallBody | (() => ApiCallBody);
    File?: ApiCallFile | (() => ApiCallFile);
    IsUpdateStore?: boolean;
} & ApiCallback;
type ApiStoreValue = {
    ApiKey: string;
} & AddApiContent;
type ApiCallOption = {
    Query?: ApiCallQuery | (() => ApiCallQuery);
    Body?: ApiCallBody | (() => ApiCallBody);
    File?: ApiCallFile | (() => ApiCallFile);
    IsUpdateStore?: boolean;
} & ApiCallback;
type FileStoreType = Record<string, FileItem[]>;
type StoreType = Record<string, any> & {
    FileStore: FileStoreType;
};
type GetStoreOption = {
    CreateIfNull?: boolean;
    DefaultValue?: object;
    Clone?: boolean;
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
declare class ApiStore extends FuncBase {
    #private;
    protected $ApiStore: Record<string, ApiStoreValue>;
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
    AddApi(AddApi: Record<string, AddApiContent>): this;
    ApiCall(ApiKey: string, Option?: ApiCallOption): this;
    ApiCall_Form(ApiKey: string, Option?: ApiCallOption): this;
    protected $BaseApiCall(ApiKey: string, Option: ApiCallOption, IsFormRequest: boolean): void;
    protected $GenerateFetchRequest(Api: ApiStoreValue, ParamBody: ApiCallBody, ParamFile: ApiCallFile, IsFormRequest: boolean): RequestInit;
    UseFormJsonBody(JsonBodyKey?: string): this;
    EventAdd_AddApi(EventFunc: (EventArg: EventArg_AddApi) => void): this;
    EventAdd_UpdateStore(EventFunc: (EventArg: EventArg_UpdateStore) => void): this;
    EventAdd_AddStore(EventFunc: (EventArg: EventArg_AddStore) => void): this;
    EventAdd_SetStore(EventFunc: (EventArg: EventArg_SetStore) => void): this;
    protected $EventAdd<EventArgType>(EventName: string, OnFunc: (EventArg: EventArgType) => void): void;
    protected $EventTrigger<EventArgType>(EventName: string, EventArg: EventArgType): void;
    UpdateStore(StorePath: PathType, StoreData: any): this;
    AddStore(StorePath: PathType, StoreData?: any): this;
    SetStore(StorePath: PathType, StoreData: any): this;
    GetStore<TStore = any>(StorePath: PathType, Option?: GetStoreOption | boolean): TStore;
    ClearStore(StorePath: PathType): this;
    protected $RCS_GetStore(StorePath: string, FindStore: any, Option: {
        CreateIfNull: boolean;
        DefaultValue: object;
    }): any;
    protected $RCS_SetStore(StorePath: string, StoreData: any, FindStore: any, Option?: {
        IsDeepSet: boolean;
    }): any;
    protected $DeepSetObject(StorePath: string, SetData: Record<string, any>, FindStore: any): void;
    AddFileStore(FileStoreKey: string): this;
    Files(FileStoreKey: string, WhereFunc?: (FileArg: FileItem) => boolean): File[];
    AddFile(FileStoreKey: string, AddFile: FilesType, ConvertType?: FileConvertType | FileConvertType[]): this;
    RemoveFile(FileStoreKey: string, DeleteFileId: string | string[]): this;
    ClearFile(FileStoreKey: string): this;
    protected $ProcessApiReturn(ApiResponse: Response): Promise<any>;
    NavigateToRoot(): this;
    protected $ConvertTo_ApiDomainUrl(Url: string, Param?: string | object): string;
    protected $ConvertTo_FormData(ConvertFormData: FormData | Record<string, any>, Form: FormData): FormData;
    protected $ConvertTo_FormFile(FileParam: FormDataFileType, Form: FormData): FormData;
    protected $AppendFileToFormData(FileKey: string, Form: FormData, FileData: FilesType): FormData;
}
import { App, Plugin } from 'vue';
declare class VueStore extends ApiStore {
    #private;
    $VueProxy: any;
    $VueOption: Record<string, any>;
    $VueApp: App;
    $VueUse: Plugin[];
    $MountedFuncs: Function[];
    constructor();
    get Store(): StoreType;
    protected set Store(Store: StoreType);
    WithVueOption(VueOption?: {}): this;
    WithMounted(MountedFunc?: () => void): this;
    WithComponent(Component?: {}): this;
    WithVueUse(...UsePlugin: Plugin[]): this;
    ForceUpdate(): this;
    Refs(RefName: string): any;
}
type AddV_ModelOption = {
    ModelValue?: string;
    DefaultValue?: any;
};
type AddV_FilePickerOption = {
    StorePath: string;
    Accept?: string | string[];
    Multiple?: boolean;
    ConvertType?: FileConvertType | FileConvertType[];
};
declare class VueCommand extends VueStore {
    protected $IsInited: boolean;
    $QueryDomName: string;
    WithQueryAttribute(QueryDomName: string): this;
    AddV_Text(DomName: PathType, Option: AddCommandOption): this;
    AddV_Model(DomName: PathType, StorePath: PathType, Option?: AddV_ModelOption): this;
    AddV_Slot(DomName: PathType, SlotKey: string, StorePath: string): this;
    AddV_For(DomName: PathType, Option?: AddCommandOption, ForKey?: PathType): this;
    AddV_If(DomName: PathType, Option: AddCommandOption): this;
    AddV_Show(DomName: PathType, Option: AddCommandOption): this;
    AddV_Bind(DomName: PathType, BindKey: string, Option: AddCommandOption): this;
    AddV_On(DomName: PathType, EventName: string, Option: AddCommandOption): this;
    AddV_OnChange(DomName: PathType, ChangeFunc: AddCommandOption): this;
    AddV_Click(DomName: PathType, Option: AddCommandOption, Args?: string): this;
    AddV_Function(FuncName: PathType, Func: Function): this;
    AddV_Watch(WatchPath: PathType, Func: Function, Deep?: boolean, Option?: any): this;
    AddV_FilePicker(DomName: PathType, Option: string | AddV_FilePickerOption): this;
    AddV_Tree(TreeRoot: PathType, TreeSet: TreeSetType): this;
    private $ParseTreeSet;
    AddV_Property(PropertyPath: PathType, Option: AddPropertyType): this;
    protected $BaseAddProperty(PropertyStore: StoreType, PropertyKey: string, Option: AddPropertyType): StoreType;
    protected $ConvertCommandOption(DomName: PathType, Option?: AddCommandOption): CommandOption;
    protected $AddCommand(DomName: PathType, Command: string, Option: CommandOption): void;
    protected $SetAttribute(Dom: HTMLElement, AttrName: string, AttrValue: string): void;
    protected $RandomFuncName(BaseFuncName: string): string;
    protected $GenerateEventFunction(DomName: PathType, EventFunc: Function, Command: string): string;
}
declare class VueModel extends VueCommand {
    $MountId: string;
    Id: string;
    constructor();
    WithMountId(MountId: string): this;
    Init(): this;
    Using(UseFunc?: () => void): this;
}
declare const Model: VueModel;
export { Model, VueModel, FuncBase, ApiStore, VueStore, };
