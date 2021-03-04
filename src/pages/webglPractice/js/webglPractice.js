/**
 * @since 2021/02/19 18:52:44
 */

import {createShaderFromScript, getCanvas, resizeCanvas, getContext, createSimpleProgram, randomColor} from '@/util/webgl-helper.js'
//获取canvas
let canvas = getCanvas('#canvas');
//设置canvas尺寸为满屏
resizeCanvas(canvas);
//获取绘图上下文
let gl = getContext(canvas);
//创建定点着色器
let vertexShader = createShaderFromScript(gl, gl.VERTEX_SHADER, 'vertexShader');
//创建片元着色器
let fragmentShader = createShaderFromScript(gl, gl.FRAGMENT_SHADER, 'fragmentShader');
//创建着色器程序
let program = createSimpleProgram(gl, vertexShader, fragmentShader);
//使用该着色器程序
gl.useProgram(program);

//获取顶点着色器中的变量a_Position的位置。
let a_Position = gl.getAttribLocation(program, 'a_Position');
//获取顶点着色器中的变量a_Screen_Size的位置。
let a_Screen_Size = gl.getAttribLocation(program, 'a_Screen_Size');

//获取片元着色器中的变量u_Color的位置。
let u_Color = gl.getUniformLocation(program, 'u_Color');
//向顶点着色器的 a_Screen_Size 传递 canvas 尺寸信息。
gl.vertexAttrib2f(a_Screen_Size, canvas.width, canvas.height);

//存储区顶点信息的容器
let points = [];

canvas.addEventListener('click', e=>{
    let x = e.pageX;
    let y = e.pageY;
    let color = randomColor();
    //存储新的点的坐标和颜色。
    points.push({x : x, y : y, color : color})
    render(gl);
})
//绘制函数
function render(gl){
    //清除屏幕
    gl.clear(gl.COLOR_BUFFER_BIT);
    for(let i = 0; i<points.length;i++){
        let color = points[i].color;
        //向片元着色器传递颜色信息
        gl.uniform4f(u_Color, color.r, color.g, color.b, color.a);
        //向顶点着色器传递坐标信息。
        gl.vertexAttrib2f(a_Position, points[i].x, points[i].y);
        //绘制点。
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}
//设置屏幕清除颜色为黑色。
gl.clearColor(0,0,0,1.0);
//绘制
render(gl);