/**
 *  VcController.js v3.1.1
 *  From Rugal Tu
 *  Based on VueModel.js
 * */

class VcController extends CommonFunc {

    constructor() {
        super();

        this.Configs = {};
        this.IsConfigDone = false;
        this.CommandNameProp = [
            'column', 'mode', 'default',
            'from', 'value', 'of', 'to', 'display',
            'key', 'bind',
            'select', 'option',
            'multi', 'checked', 'label'];

        this.DefaultVcName = 'Default';
        this.IsUseQueryWhere_VcName = false;

        try {
            this.Model = Model;
        }
        catch {
            this.Model = new VueModel();
        }
    }

    //#region Property
    get Dom() {
        return new DomEditor();
    }
    //#endregion

    //#region With Property
    With_VueModel(SetModel) {
        this.Model = SetModel;
        return this;
    }
    //#endregion

    //#region Add Setting
    AddVc_Config(Config = { VcName: null, Api: {}, Bind: {} }) {
        let VcName = Config['VcName'] ?? this.DefaultVcName;
        this._Create_Config(VcName);
        this._DeepObjectExtend(this.Configs[VcName], Config);

        this._ClearConfig();
        return this;
    }

    AddVc_Config_Api(Api) {
        let VcName = Api['VcName'] ?? this.DefaultVcName;
        this._Create_Config(VcName);
        this._DeepObjectExtend(this.Configs[VcName]['Api'], Api);
        this._ClearConfig(VcName);
        return this;
    }

    AddVc_Config_Bind(VcName, Bind) {
        this._Create_Config(VcName);
        this._DeepObjectExtend(this.Configs[VcName]['Bind'], Bind);
        this._ClearConfig(VcName);
        return this;
    }
    //#endregion

    //#region Query Setting
    UseQueryWhere_VcName() {
        this.IsUseQueryWhere_VcName = true;
        return this;
    }
    //#endregion

    //#region Startup
    AsNew() {
        return new VcController();
    }

    Init() {
        if (!this.IsConfigDone) {
            this._SetApi();
            this._SetBind();
            this.IsConfigDone = true;
        }
        return this;
    }
    //#endregion

    //#region Using VueModel2
    _SetApi() {
        this._ForEachKeyValue(this.Configs, (VcName, Config) => {
            this._ForEachKeyValue(Config['Api'], (ApiKey, ApiContent) => {
                this._VueModel_AddApi(ApiKey, ApiContent);
            });
        });
        return this;
    }
    _VueModel_AddApi(ApiKey, ApiContent) {
        let MethodType = ApiContent['Type'].toLocaleUpperCase();
        if (MethodType == 'GET')
            this.Model.AddApi_Get(ApiKey, ApiContent);
        else if (MethodType == 'POST')
            this.Model.AddApi_Post(ApiKey, ApiContent);
        else
            throw new Error('error MethodType');
    }

    _SetBind() {
        this._ForEachKeyValue(this.Configs, (VcName, Config) => {
            this._ForEachKeyValue(Config['Bind'], (StoreKey, StoreSet) => {
                this._ForEachKeyValue(StoreSet, (ColumnName, ColumnSet) => {
                    let SetArray = ColumnSet;
                    if (!Array.isArray(ColumnSet)) {
                        SetArray = [ColumnSet];
                    }

                    SetArray.forEach(Item => {
                        this._VueModel_AddColumnSet(VcName, StoreKey, Item);
                    });
                })
            });
        });
        return this;
    }
    _VueModel_AddColumnSet(VcName, StoreKey, ColumnSet) {
        let Column = ColumnSet['column'];
        let From = ColumnSet['from'];
        let Mode = ColumnSet['mode'];
        let To = ColumnSet['to'];
        let Of = ColumnSet['of'];
        let Key = ColumnSet['key'];
        let Value = ColumnSet['value'];
        let Default = ColumnSet['default'];
        let Display = ColumnSet['display'];

        let Store_VcCol = Column;
        if (Store_VcCol != null) {
            let SkipChar = ['.', '(', ')'];
            if (SkipChar.filter(Item => Store_VcCol.includes(Item)).length == 0) {
                Store_VcCol = `${StoreKey}.${Column}`;
            }
        }

        let GetDoms = this._DomsWhere_VcCol(VcName, Column);
        switch (Mode) {
            case 'text':
                From ??= Store_VcCol;
                this.Model.AddVdom_Text(GetDoms, From);
                break;
            case 'input':
                From ??= Store_VcCol;
                this.Model.AddVdom_Input(GetDoms, From, {
                    VModelKey: Key,
                });
                break;
            case 'checkbox':
                let Multi = ColumnSet['multi'] ?? false;
                let IsChecked = ColumnSet['checked'] ?? false;
                From ??= Multi == true ? StoreKey : Store_VcCol;
                this.Model.AddVdom_Checkbox(GetDoms, From, {
                    Value,
                    Multi,
                    IsChecked,
                });
                break;
            case 'for-checkbox':
                let Label = ColumnSet['label'];
                this.Model.AddVfor_Checkbox({
                    Checkbox: Column,
                    From,
                    To,
                    Value,
                    Display,
                    Of,
                    Label,
                });
                break;
            case 'select':
                let Option = ColumnSet['option'];
                let SelectQuery = this.IsUseQueryWhere_VcName ?
                    Dom._QueryString_Attr_WithVcName(VcName, 'vc-col', Column) :
                    Dom._QueryString_Attr('vc-col', Column);

                let OptionQuery = this.IsUseQueryWhere_VcName ?
                    Dom._QueryString_Attr_WithVcName(VcName, 'vc-col', Option) :
                    Dom._QueryString_Attr('vc-col', Option);

                this.Model.AddVq_Select({
                    SelectQuery,
                    From,
                    To,
                    OptionQuery,
                    Display,
                    Value,
                    Default,
                });
                break;
            case 'for':
                this.Model.AddVdom_For(GetDoms, From, Key);
                break;
            case 'file':
                this.Model.AddVdom_File(GetDoms, To ?? Column);
                break;
            case 'bind':
                this.Model.AddVdom_Bind(GetDoms, Key, Value);
                break;
        }
    }
    //#endregion

    //#region Config Review

    //#region Create And Clear
    _Create_Config(VcName) {
        if (this.Configs[VcName] == null)
            this.Configs[VcName] = {
                VcName,
                Api: {},
                Bind: {},
            };
        let GetConfig = this.Configs[VcName];
        if (!('Api' in GetConfig))
            GetConfig['Api'] = {};

        if (!('Bind' in GetConfig))
            GetConfig['Bind'] = {};

        return this;
    }
    _ClearConfig(_VcName = null) {
        let AllVcName = Object.keys(this.Configs);
        if (_VcName != null)
            AllVcName = [_VcName];

        AllVcName.forEach(VcName => {
            let GetConfig = this.Configs[VcName];

            let Api = GetConfig['Api'];
            this._ClearConfig_Api(VcName, Api);

            let Bind = GetConfig['Bind'];
            this._ClearConfig_Bind(Bind);
        });
        return this;
    }
    _ClearConfig_Api(VcName, Api) {
        this._ForEachKeyValue(Api, (ApiKey, ApiContent) => {
            let ApiProp = [
                'Url', 'Type', 'Param',
                'IsUpdateStore',
                'OnCalling', 'OnSuccess', 'OnComplete', 'OnError'];

            this._ForEachKeyValue(ApiContent, (ContentKey, Item) => {
                if (ApiProp.includes(ContentKey))
                    return;

                delete ApiContent[ContentKey];
                if (ContentKey == 'Bind') {
                    if (!this._HasAnyKeys(Item))
                        return;
                    let AddBind = {};
                    if (typeof Item != 'object')
                        this._Throw('bind set type error');

                    AddBind[ApiKey] = {
                        ...Item
                    };
                    this.AddVc_Config_Bind(VcName, AddBind);
                }
            })
        });
        return Api;
    }
    _ClearConfig_Bind(Bind) {
        this._ForEachKeyValue(Bind, StoreKey => {
            let StoreBind = Bind[StoreKey];
            let ClearCommands = [];
            this._ForEachKeyValue(StoreBind, (OrgLeftCommand, RightCommand) => {
                let LeftCommand = OrgLeftCommand;
                let LeftCommandInfo = this._Analyze_CommandInfo(LeftCommand);
                this._CheckRequired_LeftCommandInfo(LeftCommandInfo);

                LeftCommand = LeftCommandInfo.ConvertCommand;

                let RightCommandInfos = this._Analyze_RightCommandInfos(RightCommand);

                let FullCommandInfos = this._Convert_FullCommandInfos(LeftCommandInfo, RightCommandInfos, StoreKey);
                ClearCommands.splice(ClearCommands.length, 0, ...FullCommandInfos);
            });

            Bind[StoreKey] = {};
            StoreBind = Bind[StoreKey];

            ClearCommands.forEach(Command => {
                let GetColumn = Command['column'];

                let SetBind = {};
                this.CommandNameProp.forEach(Item => {
                    if (Item in Command)
                        SetBind[Item] = Command[Item];
                });
                if (GetColumn in StoreBind == false) {
                    StoreBind[GetColumn] = SetBind;
                }
                else {
                    if (Array.isArray(StoreBind[GetColumn]))
                        StoreBind[GetColumn].push(SetBind);
                    else {
                        let OrgBind = StoreBind[GetColumn];
                        StoreBind[GetColumn] = [OrgBind, SetBind];
                    }
                }
            });
        });
        return Bind;
    }
    //#endregion

    //#region Check Required
    _CheckRequired_LeftCommandInfo(LeftCommandInfo) {
        switch (LeftCommandInfo.CommandName) {
            case 'column':
                break;
            default:
                this._Throw(`error CommandName for LeftCommand of「${LeftCommandInfo.Command}」`)
        }
    }
    _CheckRequired_CommandInfo(CommandInfo, StoreKey) {

        if (CommandInfo['mode'] == 'select') {
            if (CommandInfo['to'] == null) {
                CommandInfo['to'] = CommandInfo['column']
            }
        }

        if ('column' in CommandInfo === false)
            this._Throw('「column」command is required, at least one of the param needs to be set')

        if ('mode' in CommandInfo === false)
            CommandInfo['mode'] = 'text';

        this._CheckRequired_Mode(CommandInfo['mode']);

        if ('option' in CommandInfo && CommandInfo['mode'] != 'select')
            throw new Error('if set「option」command,「mode」must be set「select」');

        if (CommandInfo['mode'] == 'select') {
            if ('display' in CommandInfo && 'option' in CommandInfo === false)
                throw new Error('if set「display」command for「select」mode,「option」command is required');

            if ('value' in CommandInfo && 'option' in CommandInfo === false)
                throw new Error('if set「value」command for「select」mode,「option」command is required');
        }

        if (CommandInfo['mode'] == 'bind') {
            if ('value' in CommandInfo === false)
                throw new Error('「value」command is required for「bind」mode');

            if ('key' in CommandInfo === false)
                throw new Error('「key」command is required for「bind」mode');
        }

        if (CommandInfo['multi'] != null) {
            let Multi = CommandInfo['multi'];
            Multi = `${Multi}`.toLowerCase() == 'true';
            CommandInfo['multi'] = Multi;
        }

        if (CommandInfo['checked'] != null) {
            let Checked = CommandInfo['checked'];
            Checked = `${Checked}`.toLowerCase() == 'true';
            CommandInfo['checked'] = Checked;
        }

        return CommandInfo;
    }
    _CheckRequired_Mode(Mode) {
        switch (Mode) {
            case 'input':
            case 'checkbox':
            case 'for-checkbox':
            case 'text':
            case 'select':
            case 'for':
            case 'file':
            case 'bind':
                break;
            default:
                throw new Error(`the「${Mode}」mode is not allow`);
        }
    }
    //#endregion

    //#region Analyze Info
    _Analyze_CommandInfo(Command) {

        let CheckCommand = Command;
        if (!CheckCommand.includes(':'))
            CheckCommand = `column:${CheckCommand}`;

        let CommandArray = CheckCommand
            .replaceAll(' ', '')
            .split(':');

        if (CommandArray.length > 2)
            this._Throw(`_Analyze_CommandInfo() only can analyze single command of「${Command}」`);

        let CommandName = this._Analyze_CommandName(CommandArray[0]);
        let CommandValue = CommandArray[1];
        let ConvertCommand = `${CommandName}:${CommandValue}`;
        let CommandInfo = {
            Command,
            CommandName,
            CommandValue,
            ConvertCommand
        };

        return CommandInfo;
    }
    _Analyze_CommandName(CommandName) {
        switch (CommandName.toLowerCase()) {

            //#region Common
            case 'from':
            case 'f':
                CommandName = 'from';
                break;

            case 'mode':
            case 'm':
                CommandName = 'mode';
                break;

            case 'column':
            case 'col':
                CommandName = 'column';
                break;

            case 'value':
            case 'val':
                CommandName = 'value';
                break;

            case 'default':
            case 'def':
                CommandName = 'default';
                break;

            case 'of':
                CommandName = 'of';
                break;

            case 'display':
            case 'dis':
                CommandName = 'display';
                break;
            //#endregion

            //#region Select
            case 'option':
            case 'opt':
                CommandName = 'option';
                break;

            case 'to':
                CommandName = 'to';
                break;
            //#endregion

            //#region Checkbox
            case 'multi':
            case 'mul':
                CommandName = 'multi';
                break;
            case 'checked':
            case 'chk':
                CommandName = 'checked';
                break;
            //#endregion

            //#region for-Checkbox
            case 'label':
            case 'lbl':
                CommandName = 'label';
                break;
            //#endregion

            //#region bind
            case 'key':
                CommandName = 'key';
                break;
            //#endregion

            default:
                throw new Error(`error CommandName of「${CommandName}」`);
        }
        return CommandName;
    }
    _Analyze_RightCommandInfos(RightCommand) {

        let ParamGroups = [];
        if (Array.isArray(RightCommand)) {
            ParamGroups = RightCommand
                .map(Item => this._Convert_CommandInfo_CommandString(Item));
        }
        else {
            RightCommand = this._Convert_CommandInfo_CommandString(RightCommand);
            ParamGroups = RightCommand
                .replaceAll(' ', '')
                .split(/[\[\]]/);
        }

        let CommandInfos = ParamGroups.map(Group => {
            let CommandArray = Group
                .split(';')
                .filter(Item => !this._IsNullOrEmpty(Item));

            let SetCommandInfo = {};
            CommandArray.forEach(GetCommand => {
                if (!GetCommand.includes(':'))
                    this._Throw('CommandName is a required parameter in CommandLine mode.');

                let GetInfo = this._Analyze_CommandInfo(GetCommand);
                SetCommandInfo[GetInfo.CommandName] = GetInfo.CommandValue;
            });

            return SetCommandInfo;
        })

        return CommandInfos;
    }
    //#endregion

    //#region Convert
    _Convert_CommandInfo_CommandString(BindCommand) {
        if (typeof BindCommand === 'string')
            return BindCommand;

        if (typeof BindCommand === 'object') {
            let CommandArray = [];
            let AllKeys = Object.keys(BindCommand);
            for (let i = 0; i < AllKeys.length; i++) {
                let Key = AllKeys[i];
                let Value = BindCommand[Key];
                CommandArray.push(`${Key}:${Value}`);
            }
            let CommandString = CommandArray.join(';');
            return CommandString;
        }

        throw new Error('error command type');
    }
    _Convert_FullCommandInfos(LeftCommandInfo, RightCommandInfos, StoreKey) {
        let FullCommandInfos = RightCommandInfos
            .map(CommandInfo => {
                let LeftCommandName = LeftCommandInfo['CommandName'];
                CommandInfo[LeftCommandName] = LeftCommandInfo['CommandValue'];

                let InfoResult = this._CheckRequired_CommandInfo(CommandInfo, StoreKey);
                return InfoResult;
            });

        return FullCommandInfos;
    }
    //#endregion

    //#endregion

    //#region Doms Where
    _DomsWhere(VcName, ...WhereAnd) {
        let GetDom = this.Dom;
        if (this.IsUseQueryWhere_VcName)
            GetDom.WithAttr('vc-name', VcName);

        WhereAnd.forEach(Item => {
            GetDom.WithCustom(Item);
        });

        return GetDom;
    }
    _DomsWhere_VcCol(VcName, VcCol, ...WhereAnd) {
        let GetDom = this.Dom;
        if (this.IsUseQueryWhere_VcName)
            GetDom.WithAttr('vc-name', VcName);

        GetDom.WithAttr('vc-col', VcCol);
        WhereAnd.forEach(Item => {
            GetDom.WithCustom(Item);
        });

        return GetDom;
    }
    //#endregion
}
const Vc = new VcController();