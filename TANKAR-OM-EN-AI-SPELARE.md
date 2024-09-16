# Hur många sätt att vinna på finns det i Tic-Tac-Toe?
* 8 stycken - 3 horisontella, 3 vertikala,  2 diagonala.
* Låt oss kalla dessa "winCombos" (winning combinations).
* (I Fyra-i-rad finns det 69 olika "winCombos"...)

# Vad utgör ett bra drag? Kan vi poängsätta/"scora" de olika drag en bot kan göra?
* Om vi påverkar så många "winCombos" positivt.
* Vad är positiv påverkan? Vi ökar våra vinstchanser i en-flera winCombos eller
  blockerar för motståndaren i en-flera winCombos.
* winCombos som redan har minst en pjäs från motspelaren och minst en pjäs från mig
  är meninslösa att titta på... de går inte att vinna för någondera spelare.

