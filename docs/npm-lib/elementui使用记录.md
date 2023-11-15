---
slug: elementui
tags: [npmlib, 记录]
---

### 1. el-radio切换不了
- 查看选中的值有没有变
- 选中的值变了，但是显示的没变，可以在change事件中强更新
```js
handleChange() {
  this.$forceUpdate();
}
```

### 2. el-form校验不通过
- 初次按规则输入，校验正常通过
- 回填后，清空，再填，相同规则校验一直不能通过
- 发现清空时对表单字段的处理有问题，表单对象初始化没有的字段，使用`delete`关键字清空
```js
<el-form :model="form">
  <el-form-item label="AAA：" prop="a" :rules="[ { required: true, message: '请选择AAA', trigger: 'change'} ]">
    <el-cascader
      v-model="form.a"
      :options="aOptions"
      :props="aProps"
      @change="handleChangeAAA"
      style="width: 100%;"
      clearable
    >
    </el-cascader>
  </el-form-item>
  <el-form-item label="BBB：" prop="b" :rules="[ { required: true, message: '请选择BBB', trigger: 'change'} ]">
    <el-select v-model="form.b" placeholder="请选择">
      <el-option
        v-for="(item, index) in bOptions"
        :label="item.label"
        :value="item.value"
        :key="index"
      ></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="CCC：" prop="c" :rules="{ required: true, message: '请选择CCC', trigger: 'change' }">
    <el-radio-group v-model="form.c" @change="handleChangeCCC">
      <el-radio :label="1" >CCC-1</el-radio>
      <el-radio :label="2" >CCC-2</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="DDD：" prop="d" :rules="[
    { required: true, message: '请填写DDD', trigger: ['blur', 'change'] },
    { max: 50, message: '不可超过50个字符', trigger: ['blur', 'change'] }
  ]">
    <el-input v-model="form.d" type="textarea" :rows="2" placeholder="请输入不超过50个字符"></el-input>
  </el-form-item>
</el-form>

<script>
  export default {
    data() {
      return {
        form: {},
      }
    },
    methods: {
      // 回填
      handleEcho() {
        this.form.a = 1;
        this.form.b = 'bbbbbb';
        this.form.c = 10;
        this.form.d = 'dddddd';
      },
      // 清空
      handleClear() {
        delete this.form.a; // this.form.a = null; 赋值null能清空，但再次选择后校验依然是该项没值
        this.form.b = ''; // 字符串类型的字段赋值空字符串也正常，不用delete
        delete this.form.c; // this.form.c = null; 赋值null能清空，但再次选择后校验依然是该项没值
        this.form.d = ''; // 字符串类型的字段赋值空字符串也正常，不用delete
      },
    },
  }
</script>
```
