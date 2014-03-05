var assert = chai.assert;

suite('Tokens', function(){
  // Probar la función bexec
  test('RegExp.bexec()', function(){
    var input_str = "prueba";
	var regexp = /ba/;
	regexp.lastIndex = 0;
	
	assert.equal(regexp.bexec(input_str), null);
  });

  // Probar la función String.tokens sobre una string sencilla.
  test('String.tokens()', function(){
    var input_str = "var a = b;";
    var esperado_str = "[{\"type\":\"name\",\"value\":\"var\",\"from\":0,\"to\":3},{\"type\":\"name\",\"value\":\"a\",\"from\":4,\"to\":5},{\"type\":\"operator\",\"value\":\"=\",\"from\":6,\"to\":7},{\"type\":\"name\",\"value\":\"b\",\"from\":8,\"to\":9},{\"type\":\"operator\",\"value\":\";\",\"from\":9,\"to\":10}]";
	var resultado_str = JSON.stringify(input_str.tokens());
	
	assert.equal(esperado_str, resultado_str);
  });
  
  // Probar con un error sencillo.
  test('String.tokens(): Exccepción de error', function(){
    var input_str = "#ERROR#";
	var resultado_str = "Syntax error near '#ERROR#'";
	
    chai.expect(function () { input_str.tokens() }).to.throw(resultado_str);
  });
});

suite('Parser', function(){
  // Probamos el parser.
  test('Parser', function(){
    var parse = make_parse();
	var input_str = "var a = 20;";
	var esperado_str = "{\n    \"value\": \"=\",\n    \"arity\": \"binary\",\n    \"first\": {\n        \"value\": \"a\",\n        \"arity\": \"name\"\n    },\n    \"second\": {\n        \"value\": 20,\n        \"arity\": \"literal\"\n    }\n}";
	
	var resultado_str, tree;
    try {
      tree = parse(input_str);
      resultado_str = JSON.stringify(tree, ['key', 'name', 'message',
           'value', 'arity', 'first', 'second', 'third', 'fourth'], 4);
    } catch (e) {
      resultado_str = JSON.stringify(e, ['name', 'message', 'from', 'to', 'key',
              'value', 'arity', 'first', 'second', 'third', 'fourth'], 4);
    }
	
	assert.equal(esperado_str, resultado_str);
  });
  
  // Probamos el parser con errores.
  test('Parser: Errores', function(){
    var parse = make_parse();
	var input_str = "error = $;";
	var esperado_str = "\"Syntax error near \'$;\'\"";
	
	var resultado_str, tree;
    try {
      tree = parse(input_str);
      resultado_str = JSON.stringify(tree, ['key', 'name', 'message',
           'value', 'arity', 'first', 'second', 'third', 'fourth'], 4);
    } catch (e) {
      resultado_str = JSON.stringify(e, ['name', 'message', 'from', 'to', 'key',
              'value', 'arity', 'first', 'second', 'third', 'fourth'], 4);
    }
	
	assert.equal(esperado_str, resultado_str);
  });
});

suite('Otros', function(){
  // Probar CodeMirror+
  test('CodeMirror', function(){
    var editor = $('.CodeMirror')[0].CodeMirror;
    editor.setValue("var a = function(b) { return 20; };");
    main();
  
    var esperado_str = "{\n    \"value\": \"=\",\n    \"arity\": \"binary\",\n    \"first\": {\n        \"value\": \"a\",\n        \"arity\": \"name\"\n    },\n    \"second\": {\n        \"value\": \"function\",\n        \"arity\": \"function\",\n        \"first\": [\n            {\n                \"value\": \"b\",\n                \"arity\": \"name\"\n            }\n        ],\n        \"second\": {\n            \"value\": \"return\",\n            \"arity\": \"statement\",\n            \"first\": {\n                \"value\": 20,\n                \"arity\": \"literal\"\n            }\n        }\n    }\n}";
    var resultado_str = OUTPUT.innerHTML;
    assert.equal(esperado_str, resultado_str);
  });
});