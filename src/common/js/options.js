var packageType = [
    { value: 1, label: '客户端' },
    { value: 2, label: '游戏采集数据助手' },
    { value: 3, label: '控制台' },
    { value: 6, label: '计费代理' },
    { value: 7, label: 'Egs' },
    { value: 10, label: '播报端' },
    { value: 11, label: 'GameZq' },
];

function mergeArr() {
    return Array.prototype.concat.apply([], arguments);
}

export default {
    packageType: packageType,
    packageTypes: mergeArr([{ value: 0, label: '不限' }], packageType),
    findPackageName(val) {
        var name = '';
        for (var i = 0; i < packageType.length; i++) {
            if(packageType[i].value === val) {
                name = packageType[i].label;
                break;
            }
        }
        return name;
    },
    forceType: [
        { value: 0, label: '普通更新' },
        { value: 1, label: '重启更新' },
        { value: 2, label: '提示更新' }
    ],
    urgencyType: [
        {value: 0, label: '流控更新'},
        {value: 1, label: '紧急更新'}
    ],
    defaultpath: ['[DESKTOP]', '[ROOT]', '[WINDOWS]', '[CUR]']
};
