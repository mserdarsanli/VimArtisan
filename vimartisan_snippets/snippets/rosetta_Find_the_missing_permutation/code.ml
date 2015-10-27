(* insert x at all positions into li and return the list of results *)
let rec insert x = function
  | [] -> [[x]]
  | a::m as li -> (x::li) :: (List.map (fun y -> a::y) (insert x m))
 
(* list of all permutations of li *)
let permutations li = 
  List.fold_right (fun a z -> List.concat (List.map (insert a) z)) li [[]]
 
(* convert a string to a char list *)
let chars_of_string s =
  let cl = ref [] in
  String.iter (fun c -> cl := c :: !cl) s;
  (List.rev !cl)
 
(* convert a char list to a string *)
let string_of_chars cl =
  String.concat "" (List.map (String.make 1) cl)

let deficient_perms = [
  "ABCD";"CABD";"ACDB";"DACB";
  "BCDA";"ACBD";"ADCB";"CDAB";
  "DABC";"BCAD";"CADB";"CDBA";
  "CBAD";"ABDC";"ADBC";"BDCA";
  "DCBA";"BACD";"BADC";"BDAC";
  "CBDA";"DBCA";"DCAB";
  ]
 
let it = chars_of_string (List.hd deficient_perms)
 
let perms = List.map string_of_chars (permutations it)
 
let results = List.filter (fun v -> not(List.mem v deficient_perms)) perms
 
let () = List.iter print_endline results
