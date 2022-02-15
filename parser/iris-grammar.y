

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

// Expression is an atom or a list
Exp
    : Atom
    | List
    ;

// Atom is a number (literal), string or symbol
Atom
    : NUMBER { $$ = Number($1)}
    | STRING
    | SYMBOL
    ;

// List is a list of list entries
List 
    : '(' ListEntries ')' { $$ = $2 }
    ;

// List entry can either be empty or is made up of multiple expressions
// (Exp Exp Exp ...)
// Returned value can either be empty or is a list with an added expression

ListEntries
    : ListEntries Exp { $1.push($2); $$ = $1 } /* adding another expression recursively */
    | { $$ = [] } /* empty */
    ;
