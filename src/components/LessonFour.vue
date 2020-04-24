<template>
	<div class="lessonFour">
		<div class="words">
			<h3>1.字符的Unicode表示法</h3>
			<p class="codep">ES6加强了对Unicode的支持，允许采用 \uxxxx 形式表示一个字符，其中 xxxx 表示字符的Unicode码点。</p>
			<div class="codejs">
<pre>
"\u0061"
// "a"
</pre>
			</div>
			<p class="codep">但是，这种表示法只限于码点在 \u0000 ~ \uFFFF 之间的字符。超出这个范围的字符，必须用两个双字节的形式表示。</p>
			<div class="codejs">
<pre>
"\uD842\uDFB7"
// "𠮷"

"\u20BB7"
// " 7"
</pre>
			</div>
			<p class="codep">上面代码表示，如果直接在 \u 后面跟上超过 0xFFFF 的数值（比如 \u20BB7 ），JavaScript会理解成 \u20BB+7 。由于 \u20BB 是一个不可打印字符，所以只会显示一个空格，后面跟着一个 7 。</p>
			<p class="codep">ES6对这一点做出了改进，只要将码点放入大括号，就能正确解读该字符。</p>
			<div class="codejs">
<pre>
"\u{20BB7}"
// "𠮷"

"\u{41}\u{42}\u{43}"
// "ABC"

let hello = 123;
hell\u{6F} // 123

'\u{1F680}' === '\uD83D\uDE80'
// true
</pre>
			</div>
			<p class="codep">上面代码中，最后一个例子表明，大括号表示法与四字节的UTF-16编码是等价的。</p>
			<p class="codep">有了这种表示法之后，JavaScript共有6种方法可以表示一个字符。</p>
			<div class="codejs">
<pre>
'\z' === 'z'  // true
'\172' === 'z' // true
'\x7A' === 'z' // true
'\u007A' === 'z' // true
'\u{7A}' === 'z' // true
</pre>
			</div>
			<hr>
			<h3>2.字符串的遍历器接口</h3>
			<p class="codep">ES6为字符串添加了遍历器接口（详见《Iterator》一章），使得字符串可以被 for...of 循环遍历。</p>
			<div class="codejs">
<pre>
for (let codePoint of 'foo') {
  console.log(codePoint)
}
// "f"
// "o"
// "o"
</pre>
			</div>
			<p class="codep">除了遍历字符串，这个遍历器最大的优点是可以识别大于 0xFFFF 的码点，传统的 for 循环无法识别这样的码点。</p>
			<div class="codejs">
<pre>
let text = String.fromCodePoint(0x20BB7);

for (let i = 0; i < text.length; i++) {
  console.log(text[i]);
}
// " "
// " "

for (let i of text) {
  console.log(i);
}
// "𠮷"
</pre>
			</div>
			<p class="codep">上面代码中，字符串 text 只有一个字符，但是 for 循环会认为它包含两个字符（都不可打印），而 for...of 循环会正确识别出这一个字符。</p>
			<hr>
			<h3>3.直接输入 U+2028 和 U+2029</h3>
			<p class="codep">JavaScript字符串允许直接输入字符，以及输入字符的转义形式。举例来说，“中”的Unicode码点是U+4e2d，你可以直接在字符串里面输入这个汉字，也可以输入它的转义形式 \u4e2d ，两者是等价的。</p>
			<div class="codejs">
<pre>
'中' === '\u4e2d' // true
</pre>
			</div>
			<p class="codep">但是，JavaScript规定有5个字符，不能在字符串里面直接使用，只能使用转义形式。</p>
			<div class="list">
				<ul>
					<li>U+005C：反斜杠（reverse solidus)</li>
					<li>U+000D：回车（carriage return）</li>
					<li>U+2028：行分隔符（line separator）</li>
					<li>U+2029：段分隔符（paragraph separator）</li>
					<li>U+000A：换行符（line feed）</li>
				</ul>
			</div>
			<p class="codep">举例来说，字符串里面不能直接包含反斜杠，一定要转义写成 \\ 或者 \u005c 。</p>
			<p class="codep">这个规定本身没有问题，麻烦在于JSON格式允许字符串里面直接使用U+2028（行分隔符）和U+2029（段分隔符）。这样一来，服务器输出的JSON被 JSON.parse 解析，就有可能直接报错。</p>
			<div class="codejs">
<pre>
const json = '"\u2028"';
JSON.parse(json); // 可能报错
</pre>
			</div>
			<p class="codep">JSON格式已经冻结（RFC7159），没法修改了。为了消除这个报错，ES2019允许JavaScript字符串直接输入U+2028（行分隔符）和U+2029（段分隔符）。</p>
			<div class="codejs">
<pre>
const PS = eval("'\u2029'");
</pre>
			</div>
			<p class="codep">根据这个提案，上面的代码不会报错。</p>
			<p class="codep">注意，模板字符串现在就允许直接输入这两个字符。另外，正则表达式依然不允许直接输入这两个字符，这是没有问题的，因为JSON本来就不允许直接包含正则表达式。</p>
			<hr>
			<h3>4.JSON.stringify() 的改造</h3>
			<p class="codep">根据标准，JSON数据必须是UTF-8编码。但是，现在的 JSON.stringify() 方法有可能返回不符合UTF-8标准的字符串。</p>
			<p class="codep">具体来说，UTF-8标准规定， 0xD800 到 0xDFFF 之间的码点，不能单独使用，必须配对使用。比如， \uD834\uDF06 是两个码点，但是必须放在一起配对使用，代表字符𝌆。这是为了表示码点大于 0xFFFF 的字符的一种变通方法。单独使用 \uD834 和 \uDFO6 这两个码点是不合法的，或者颠倒顺序也不行，因为 \uDF06\uD834 并没有对应的字符。</p>
			<p class="codep"> JSON.stringify() 的问题在于，它可能返回 0xD800 到 0xDFFF 之间的单个码点。</p>
			<div class="codejs">
<pre>
JSON.stringify('\u{D834}') // "\u{D834}"
</pre>
			</div>
			<p class="codep">为了确保返回的是合法的UTF-8字符，ES2019改变了 JSON.stringify() 的行为。如果遇到 0xD800 到 0xDFFF 之间的单个码点，或者不存在的配对形式，它会返回转义字符串，留给应用自己决定下一步的处理。</p>
			<div class="codejs">
<pre>
JSON.stringify('\u{D834}') // ""\\uD834""
JSON.stringify('\uDF06\uD834') // ""\\udf06\\ud834""
</pre>
			</div>
			<hr>
			<h3>5.模板字符串</h3>
			<p class="codep">传统的JavaScript语言，输出模板通常是这样写的（下面使用了jQuery的方法）。</p>
			<div class="codejs">
<pre>
$('#result').append(
  'There are <span><</span>b<span>></span>' + basket.count + '<span></</span>b<span>></span> ' +
  'items in your basket, ' +
  '&lt; em>' + basket.onSale +
  '&lt; /em> are on sale!'
);
</pre>
			</div>
			<p class="codep">上面这种写法相当繁琐不方便，ES6引入了模板字符串解决这个问题。</p>
			<div class="codejs">
<pre>
$('#result').append(`
  There are &lt; b>${basket.count}&lt; /b> items
   in your basket, &lt; em>${basket.onSale}&lt; /em>
  are on sale!
`);
</pre>
			</div>
			<p class="codep">模板字符串（template  string）是增强版的字符串，用反引号（`）标识。它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量。</p>
			<div class="codejs">
<pre>
// 普通字符串
`In JavaScript '\n' is a line-feed.`

// 多行字符串
`In JavaScript this is
 not legal.`

console.log(`string text line 1
string text line 2`);

// 字符串中嵌入变量
let name = "Bob", time = "today";
`Hello ${name}, how are you ${time}?`
</pre>
			</div>
			<p class="codep">上面代码中的模板字符串，都是用反引号表示。如果在模板字符串中需要使用反引号，则前面要用反斜杠转义。</p>
			<div class="codejs">
<pre>
let greeting = `\`Yo\` World!`;
</pre>
			</div>
			<p class="codep">如果使用模板字符串表示多行字符串，所有的空格和缩进都会被保留在输出之中。</p>
			<div class="codejs">
<pre>
&#36;('&#35;list').html(`
&lt; ul>
  &lt; li>first&lt; /li>
  &lt; li>second&lt; /li>
&lt; /ul>
`);
</pre>
			</div>
			<p class="codep">上面代码中，所有模板字符串的空格和换行，都是被保留的，比如 &lt;ul&gt; 标签前面会有一个换行。如果你不想要这个换行，可以使用 trim 方法消除它。</p>
		    <div class="codejs">
<pre>
&#36;( '&#35;list').html(`
&lt; ul&gt;
  &lt; li&gt;first&lt;/li&gt;
  &lt; li&gt;second&lt;/li&gt;
&lt; /ul&gt;
`.trim());
</pre>
		    </div>
		    <p class="codep">模板字符串中嵌入变量，需要将变量名写在 ${} 之中。</p>
			<div class="codejs">
<pre>
function authorize(user, action) {
  if (!user.hasPrivilege(action)) {
    throw new Error(
      // 传统写法为
      // 'User '
      // + user.name
      // + ' is not authorized to do '
      // + action
      // + '.'
      `User ${user.name} is not authorized to do ${action}.`);
  }
}
</pre>
			</div>
			<p class="codep">大括号内部可以放入任意的JavaScript表达式，可以进行运算，以及引用对象属性。</p>
			<div class="codejs">
<pre>
let x = 1;
let y = 2;

`${x} + ${y} = ${x + y}`
// "1 + 2 = 3"

`${x} + ${y * 2} = ${x + y * 2}`
// "1 + 4 = 5"

let obj = {x: 1, y: 2};
`${obj.x + obj.y}`
// "3"
</pre>
			</div>
			<p class="codep">模板字符串之中还能调用函数。</p>
			<div class="codejs">
<pre>
function fn() {
  return "Hello World";
}

`foo ${fn()} bar`
// foo Hello World bar
</pre>
			</div>
			<p class="codep">如果大括号中的值不是字符串，将按照一般的规则转为字符串。比如，大括号中是一个对象，将默认调用对象的 toString 方法。</p>
			<p class="codep">如果模板字符串中的变量没有声明，将报错。</p>
			<div class="codejs">
<pre>
// 变量place没有声明
let msg = `Hello, ${place}`;
// 报错
</pre>
			</div>
			<p class="codep">由于模板字符串的大括号内部，就是执行 JavaScript 代码，因此如果大括号内部是一个字符串，将会原样输出。</p>
			<div class="codejs">
<pre>
`Hello ${'World'}`
// "Hello World"
</pre>
			</div>
			<p class="codep">模板字符串甚至还能嵌套。</p>
			<div class="codejs">
<pre>
const tmpl = addrs => `
  &lt; table>
  ${addrs.map(addr => `
    &lt; tr>&lt; td>${addr.first}&lt; /td>&lt; /tr>
    &lt; tr>&lt; td>${addr.last}&lt; /td>&lt; /tr>
  `).join('')}
  &lt; /table>
`;
</pre>
			</div>
			<p class="codep">上面代码中，模板字符串的变量之中，又嵌入了另一个模板字符串，使用方法如下。</p>
			<div class="codejs">
<pre>
const data = [
    { first: '&lt; Jane>', last: 'Bond' },
    { first: 'Lars', last: '&lt; Croft>' },
];

console.log(tmpl(data));
));
// <code>&lt;table&gt;</code>
//
//   &lt; tr>&lt; td>&lt; Jane>&lt; /td>&lt; /tr>
//   &lt; tr>&lt; td>Bond&lt; /td>&lt; /tr>
//
//   &lt; tr>&lt; td>Lars&lt; /td>&lt; /tr>
//   &lt; tr>&lt; td>&lt; Croft>&lt; /td>&lt; /tr>
//
// &lt; /table>
</pre>
			</div>



		</div>

			<p class="codep"></p>
			<div class="codejs">
<pre>

</pre>
			</div>
	</div>
</template>

<script>
export default ({
	name: 'lessonFour',
	data() {
		return {
			title: 'lessonFour'
		}
	},
	mounted() {
		let _this = this;
		$(".codejs pre").each(function() {
			let str = $(this).text();
			let newStr = _this.$parent.checkStr(str);
			$(this).html(newStr);
		});
		$(".words p.codep").each(function(index, el) {
			let str = $(this).html();
			let newStr = _this.$parent.checkCode(str);
			$(this).html(newStr);
		});
	}
});
</script>