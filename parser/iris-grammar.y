

//    S-expression parser bnf for Iris



// Lexical grammar(tokens):

%lex

%%



\s+ /* Skip whitespace */
\"[^\"]*\" return 'STRING' 

\d+\.\d+    return 'NUMBER'

[\w\-+*=<>/]+ return 'SYMBOL'

/lex


// Syntax grammar(BNF):

%%

Exp
    : Atom
    | List
    ;

Atom
    : NUMBER { $$ = Number($1)}
    | STRING
    | SYMBOL
    ;

List 
    : '(' ListEntries ')' { $$ = $2 }
    ;

// (Exp Exp Exp ...)

ListEntries
    : ListEntries Exp { $1.push($2); $$ = $1 } /* recursive */
    | { $$ = [] } /* empty */
    ;
