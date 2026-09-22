import { ImageResponse } from "next/og";
import proposalsData from "@/data/proposals.json";

export const runtime = "edge";
export const alt = "Propuesta Comercial | Universa Agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const UNIVERSA_LOGO_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA/IAAALPCAYAAADB8fv/AAAACXBIWXMAAAsSAAALEgHS3X78AAAgAElEQVR4nOzd4XUbR5Y24Hf2zH/xi0C9EYgbgTARWBuB4QisiWDoCCxHMHAEK0dgKIKRIhgyghUj8PejiCVMgWQ3iO6qRj/POTy06CZwBRKtfrtuVf3ljz/+CAAAADAP/1G7AAAAAKA/QR4AAABmRJAHAACAGRHkAQAAYEYEeQAAAJgRQR4AAABmRJAHAACAGRHkAQAAYEYEeQAAAJgRQR4AAABmRJAHAACAGRHkAQAAYEYEeQAAAJgRQR4AAABmRJAHAACAGRHkAQAAYEb+WrsAAAAmdZFkfff5c5KPVatpy4e7z++rVgHwjL/88ccftWsAAGA6qyS/3/33bUqgp9hdGP+/JF9rFgLwFK31AADL9ap2AY1a1y4A4CmCPHCOLpNc1S6iQRdJ3qW8NquqlQC0TZcC0DRBHjhHH5L8I0lXuY7WfEzyPymvze8poR6Ab3W1CwB4iiAPnDNB9WleH4DDutoFADxFkAfOUXf3+bJmETPQ1S4AaEJXuwAAhhHkgXP0+u5zV7MIgJnoahcAwDCCPAAAAMyIIA8AAAAzIsgDAADAjAjyAAAAMCOCPAAAAMyIIA+wXBe1CwBolO1LgaYJ8gDL9aZ2AQCNelW7AICnCPIAAAAwI4I8AMCyrWoXAMAwgjxwzrraBQAAwKkJ8sA5e127AAAAODVBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAD41kXtAgAeI8gDAMC3LmsXAPAYQR4AAABmRJAHAFi2rnYBAAwjyAMs26p2AUB1Xe0CABhGkAcAAIAZEeQBAABgRgR54NytahcAAACnJMgDAADAjAjyAAAAMCOCPAAAfOuydgEAjxHkAQDgWxe1CwB4jCAPAAAAMyLIAwAs29vaBQAwjCAPAAAAMyLIAwAAwIwI8gDLtqpdAAAAwwjyAAAAMCOCPHDubB8EAMBZEeSBc3dZuwAAZqmrXQDAYwR5AAD4Vle7AIDHCPIAAAAwI4I8AABd7QIA6E+QBwCgq10AAP0J8gAAADAjgjwAAADMiCAPAAAAMyLIAwAAwIwI8gDLdlm7AIBGOT8CzRLkgXPX1S6gcRe1CwBo1KvaBQA8RpAHzl1XuwAAADglQR4AAABmRJAHAGBVuwAA+hPkAQAAYEYEeQAAAJgRQR4AAABmRJAHAIDDbNEJNEmQBwCAwy5rFwBwiCAPAAAAMyLIA+dOWyQAAGdFkAfO3ZvaBTTube0CAAAYRpAHAED3EsCMCPIAAFjUDWBGBHkAAACYEUEeAAAAZkSQBwCAw7raBQAcIsgDAMBhXe0CAA4R5AEAqG1duwCAORHkAQCoaZPkn0neV64DYDYEeQAAavr+7vPPVasAmBFBHlgC+yMDAHA2BHlgCS5qFwDQODc8AWZEkAdgVbsAoLpXtQu444YCQA+CPAAArdBBBdCDIA8AAId1tQsAOESQBwCAw7raBQAcIsgDAADAjAjyAAAAMCOCPAAAAMyIIA8AQCtsPwfQgyAPLEFXuwCAGWhh67cWagBoniAPLEFXuwCAGTAaDjATgjwAAADMiCAPgFZWgMN0KQBNEuQBcKEKcNir2gUAHCLIAwAAwIwI8gAAtGJVuwCAORDkAQAAYEYEeQAAAJgRQR4AAABmRJAHlqD29mofk3SVawB4jh0sAGZCkAeWoObF6bsk36WEeYCW1b7pCUBPgjzAuN7ffX6z998AHNbizYRV7QIAHhLkAabT4gUqQEve1C4AYA4EeQAAAJgRQR6ArnYBAAD0J8gDTKfV1vqudgEAAPQnyANMx9ZOAAC8mCAPAAAAMyLIAwCQtDP9p6tdAEDrBHkAAJJ2pv90tQt4oJUbHAD/R5AHluBt7QIAmK1WbnAA/B9BHmA6LgYBAHgxQR5gOq9qFwAAwPwJ8gAAADAjgjwAAADMiCAPAEBLutoFALROkAfAInxAS7raBQC0TpAHmFaLodkifAAAMyLIA0zronYBAI9o8UZjC7raBQA8JMgDAJDoznlMV7sAgIcEeWApjDQBAHAWBHlgKbS0AwBwFgR5AABaooMK4BmCPAAALdFBBfCMv9YuAGBhutoFLEiX5H3+PLr3Ocnm7jMAwCwJ8gDT6moXsBAfkvx44Otv777+S5KrJF8nrAkA4CS01gNwbjY5HOL3/ZhkO3olAAAjEOQBOCdXSb7veeybu+MBnmLxPaA5gjwASbKqXcAJXKTMiR/iHzHdAfatahfQoFe1CwB4SJAH4Fy8y3EX3O9OXQjwIm9rFwDQOkEeWIqudgGMrpv4+wAAqhDkgaXoahdAs7raBQAADCHIA0yrq10A37CnPAAwK4I8wLS62gWcsY9Hfp8gDwDMiiAPwLn4nOTTwO+5yfE3AAAAqhDkATgn75PcDjjeivUAwOwI8gCck88p4fy5MH+b5Idoq4dWrWoX8MCqdgEA+wR5AM7NNsllkt8e+f+f7v7/ZqJ6YE662gUA8Ly/1i4AAEZwnTIy3919rFIC/vXdB3BYV7sAAJ4nyAOQnO/F+/Xdx7ZqFQAAJ6S1HliKi9oF3OlqF/CIrnYBAAD0I8gDS3FZu4A7r2sXAADAvAnyAAC0ppUuKoAmCfIAALSmlS4qgCYJ8gAA8DQdAkBTBHkAAHiaDgGgKYI8AAAAzIggDwDAzqp2AQA8T5AHmJ65lgAAHE2QB5ieuZYAT+tqFwDQMkEeAIDWdLULAGiZIA8shVHwp3l9AABmQpAHluJV7QIaZ94+AMBMCPIAAPA0XUtAUwR5AAB4mq4loCmCPAAAAMyIIA8AwE5Xu4A7WtkBniDIA0xvVbsAgEe8rl3AHQuUAjxBkAcAAIAZEeQBAABgRgR5AAAAmBFBHliSrnYBAMyS7eeApgjywJJ0tQtomItUgMe9qV0AwD5BHoDERSrQnlXtAgBaJcgDAADAjPy1dgEAC9TVLoCzt7r73OXPv2+X6TeN4nOSr3t/3t59/nr3/wCAigR5gOl1tQvgLFym/C5d5j6gvz3RYz98nH88+PNtSqC/vvv4vPdn5m+V+5s3ADRIkAeA9nUp4WoX2k8V2I/16q6GQ3V8Sgn12wj3ADAKQR4A2tOlBPfdx+t6pQy2C/g/3v35JiXU7z6uK9QEAGdFkAeANlwmWacE93PaReB1ku/vPpLkS0qg38R8ewA4ilXrAaCeyyQfUkap/5Uyin1OIf6QNyl/z3+lLJ63SfKuZkE0a1W7gAe62gUA7BiRB5akz2rdMLYuZeR9nXm1zI/hVe5H62+SfIyRetrVxdQQoBFG5IEluaxdAIu2Tmkp/3fKKvBLD/EPvc79SP3nlNfLzTcAOECQB5iecLIcF0muUkbx/pn6q83PxZuU1+s6ZepBV7MYAGiNIA8wvVbnQHe1CzgjXUqL+HWMvr/Eq5RR+n+ntN2vqlYDAI0Q5AHY6WoXcAa6lAD/75R5369qFnNmvkvye8r0hFXVSs5fV7sAAJ4myAPAy3X5c4BnPG8j0I+tq13AHdOQAB4hyAPA8S5S5nAL8NPbD/Rd1UoYiwVKAR4hyAPAca5S5sD/WLeMxXubciNlEyO4ACyEIA8Aw6xyv4idOfDt+D7l5/K+ch2cr1XtAgB2BHkA6OciZeX032MV+la9SvJzyj70q7qlAMB4BHkAeN77lNHe7yrXQT9vUm64fIh2ewDOkCAPLMmqdgF7VrULoJcuZTG1n6ONfo5+jNF5AM6QIA8Ah61TQuDbynXwMq9zPzrPvHS1CwBolSAPAH+2mwv/zxiFPye70Xlbms2HtSgAHiHIA8C9y5SwZy78eXqTMlViXbeM5q1qFwDA0wR5AHaWvijYOsm/YhTw3L1K6bbYVK4DAI4myAOws9SW44uUUPfPynUwre9Tui+WfgOL/pZ6jgQaJMgDsGQXKa3W31eugzrepGwrKKDRh5s+QDMEeQCW6jIlxL2pXAd1vUqZUrGuXAcA9CbIA9RhBLCudykj8Valn9Zt7QKe8M8k72sXwTecKwEOEOQB6tCiWc86yf9EiK9hXbuAZ/wci+C1xrkS4ABBHlgSIzusY1G7Wm6SfLz73LLvI8wD0DhBHlgSI7DLtokQX9PHB59bJswD0DRBHoAl2MTK9LV9ePC5dUsO813tAgB4miAPwLnbRIiv7UvKDgG5+/ypWiXDLDXMv65dQKPM1weaIcgDcM42EeJb8HAUfi6j8slywzzfslUl0AxBHoBzdRUhvgU3+TYIz2HRu33CfD2r2gUAtEiQB6ijq13AmVsn+UftIkhSbqgM+XqrhHkAmiHIA9TR1S7ggFXtAk5kHavTt+LQaPzOJmXu/Jx8n+R97SIAQJAH4JxcRohvydUz/3+OofjnlJtFAFCNIA/AubhMsq1dBP/nU55vRd8m+XX0Sk7vQ8rvGwBUIcgDS9PVLoBRXKSExleV66C4Tf9R6/d3x8/Jq5SbELYjA6AKQR5Ymq52AYziY2wN1ZL3ud83/jlfk7wbr5TR7MI843KzBOAAQR6AufuQ5G3tIvg/v2b46u7bJD+dvJLxvUn5/TtHq9oF3GltCsOqdgEAiSAPwLy9S/Jj7SL4P19y/AJ2V5nnfPkfY/E7ACYmyAPU0dUu4Ax0sa93S76kjFZ+fcFjvM/8tqRLyqh8V7sIAJZDkAeo43XtAs7Ax1jcrhWnCPG5+/5V5hfmX6X8PgLAJAR5AOboQyxu14pThfidXZj/dKLHm8qblOkBADA6QR6AuVnFvPhW/JrThvidXZif25z5f6S9xdkAOEOCPABzstsvnvr+nrLI26lD/L51kh8yr33mtdifVle7AIAWCfIA7HS1C+jhKtYXqO1Lkv/KdNuubVJGuefSav86WuxPyfsd4ABBHliai9oFNKz1C+ZVtNTXdJsyCn+Z5PPEz32d8vOfy+i8FvvztapdAEAiyAPL4+J6nrTU13Ob5KeUjo2pRuEfs0mp46e0H+hrv1Yv1dUuAIDHCfIA9XS1C5iR92m/Y+Dc3KSMwHcpreJjzoUf4mtKPV1KfTc1i3nC25Q5/nPV1S4AgMcJ8gD1dLULmIkupVWZ8d2mrBT/37kfgW8lwD/0NaW+LsnfUupubZT+Q0znAWAEgjwArdvULmABblLmn1+kjCLPbeX1bUrdF2lrHv2rlG4SXqarXQBAawR5AFq2SmlRZlyvk/wzJcCvM79R5IuUwPw55e/xqm45f/KPCKIv1dUuAKA1gjwALdvULmBhvksJwte5X1iuZZcpdf5vkp+TvKlazeOuahcAwHkR5AFo1ToWuKvlVZLvk/w7pW19VbOYA1Ypdf0rpc7WfR87ZgBwQoI8AC26yPy37zoXb5P8ntJ239UtJV3KCPzvmd+UC7/P58ENGaAJgjwALXqftuY5U9ru/516beK7OfBzGIE/5G3a62xguLmtHwGcKUEeoJ5V7QIatVu4jDb9IyVQTzUy2aW00f+c+d/c8Xt9nFXtAgBaI8gDS7OqXUDjutoFxGj8HLzJ/ZZvY1ql3DSYWxv9Y75LG++xPla1CwDgcYI8APu62gXEqOVcvEpZ4X6sud/rlLnw53ZT56p2AQDMnyAPQEvWOb/gdu5+zOm3CbxKuUlwjr6PedYAvJAgD0BLrmoXwFG+z+nC/FXKPPxzpusEgBcR5AFoxbvYN37OThHm1zn/EJ+Mv7bAuelqFwDQGkEegFYYpZy/73N8SH2X822nf+h1hPkhutoF7LGPPNAEQR6gHvNk73U5n5XJl+6fGR52upx+nn3r1rUL4CjW8ACaIMgD1GNk557R+PPyMcNuVH3M8gLS27Q10gzAjAjyALRgXbsATup1+i9ceJWyL/0SvatdAADzJMgDUNu7LG80dgl+TLJ65pguy1jc7jEtd6J0tQsA4HGCPLA0Xe0C+Ma6dgGM5uqZ//9hiiIa9jrtTrFpaQeJVl8jgGoEeWBpWro4bdHUC/BdJPlu4udkOm/z+I2aVfzsEzey+tCxA/CAIA/AvqlHvswRPn9XA7++NN4DAAwmyANQkxBz/l7n27nyl7Hd4E7L7fUctqpdAIAgD1DP0oOMtvrleLioW8uLvNWwql0AAPMiyANQi9H45fgu9wtNXiT5vl4pTfJeAGAQQR6AWla1C2BS7x585t7bTL/Q5NyYfgCwR5AHoBaBblnWd5+11R+2ql1A49zoANgjyAMsx+faBey5jC2lluZNys/9Te1CGrWqXcABXe0CADhMkAdYjq+1C9hjNH6ZNrULaNiqdgEHdLULAOAwQR5YIi2a9a1qF0AVRuMf9ybOTQD0JMgDS9TSokmr2gVUsvSt9+CQls5NPG5VuwAAQR6AfVMECWEFDlvVLgCAeRDkAdg3RWvvaoLngDlyk+txq9oFALREkAdgasIKHOa9AUAvgjwAUxNW4LDXaWvBu652AQAcJsgDMDUrl8PjWrrR1dUuAIDDBHkAprSqXQA0rqUgD0CjBHmAula1C5hYV7sAaFxLrfUANEqQB2BKXe0CoHGr2gVMbFW7gCN0tQsAEOQBmNKqdgHQOCPy7etqFwAgyANLZA5qPUIKPM1ikAA8S5AHlkiYfNzYNzmEFJiPVe0C9kxx3naTF5gNQR6Afa9qFwA0FaBbMUXIdpMXmA1BHqCuJV04rmoXAABwDgR5gLq0cgIPLekGHwBHEOQBmEpXuwCYCTf4AHiSIA/AVLraBQAAnANBHgAAAGZEkAcAAIAZEeQBmIoFvKAfc+QBeJIgDyxRV7uAPS1esHcjPW6Lf1dokZteADxJkAeWqKtdwJ5XtQs4oKtdANCEr7ULAOAwQR4AgEM+1y4AgMMEeYBxuRAGAOCkBHmAcWlNBVozxzn4booC7BHkAerrahcALMocF550UxRgjyAPUF9XuwCgKde1C7gjPAM0SpAHAGjLde0C7mhnB2iUIA+wHNeVn39b+fmB9nS1CwCYI0EeWKJt7QIe6CZ6nuuex61GrAFgX9fzuOsRawCYHUEeOEe3tQvYs+1xTDdyDQD7Vj2Pa6m1/rp2AQAtEeSBc9TSxSfAUK2cwyx2d5jXBahOkAeor5voeWqHg23l54e5WFJQtKc9wBEEeeAcze0iuJvoeeb2ugDjeNvjmE+jV1H03dN+O2YRAHMjyAPnqKXRkm3tAh6ouX6AGwnQz7Z2AQC0TZAHqK/viNQp9LnJsar43MC4up7Heb8CNEyQB5ZoyuDcx6vaBUyopR0FoEVfRn78rudxU3XQtNTmv5roeQBeTJAHztH2mf8/9eJKfS7Mp6ppO9HzPOacRvlukvyS5O9J/jvJTxk/hHH+xg7Qfc815/RePTWvDVCdIA8wvj4X5i11CfQZITvW9YiPPZXblPDeJXmf5EOSj0muUn6Of4tAz/HGDol9zzVTjMj3valwPWYRR7DeB1CdIA8s0ZhB9ZCWLvq2lZ//uvLzv9RtSvvthyeO2d4dI8xzjOuRH7/redwUo859bypcj1nEnm6i5wF4MUEeOEfb2gU8UHOBuYeuex43VofAdqTHncpV+v08v6b8TK0JwFBjB+iu53Et3YCcSle7AIC+BHlgqVa1C6jkuudxY83Z7/v8LbrJ0yPxD31Nab2HIcYO8nNcXG47Yg3H2NYuAECQBxjftscxq5Fr2Nen5Xs10nNfZ76j1NsjvufjqYvgrN1m3JHwrudx1yPW0LKpp10BHE2QB87VcyNKqymKGGDKlfSvexwzZj1zXfH5+ojv+Zr53rhgeq201V+PWMO+Vc/j5nrOABiNIA8s1ZTBedvjmDdjF7Gnz0XxmKvob0d87BZd1y6A2diO/PirnsdtR6zhGFPM1+97zptq2gHAkwR54Fw9d+E39XZvfUZlW9pLfszXZ66ja8f+fKa8ScO8tbL13PWYRezp08o+1e4PU97cBXgxQR44V89dEHdTFLGn9ij4vusex7zKeK/RdqTHHdvqiO9Zn7gGztuSgnzf4DzV6vktvTYAzxLkgaV6PfHztRbk+3QIjFXP18xzj/U3GR7mrVpPXzcZNyR26Xfem6p1vO/5ZaoOnr43Fq7HLAKgL0EeOFfbHsdM2V7fZ1RpytbO2jcWtiM+9pg26f9z+hBt9fS3HfnxWwvOfetpbUR+qnoAniTIA0vWTfhc2x7HrEauYd+2xzGrys/fotcptT8X5j8k+XH0ajgn25Eff9XzuKmCfNfzuO2INezre4Nurmt8AGdGkAfOVe0R54euexzTjVzDvm2PY8Z8fea8v/qblJ/nVf78M7tImRP/OUI8w21HfvxVz+OWOiLfdw95I/JAE/7yxx9/1K4BYCzPneB+S/JuikLu9Dnh/mX0KoqLJP/b47j/yngX9h+TfDfSY0/tNmWBQDjGTca9kdcl+XfPY6c6B31Nv/fMFPV0ae/1AXiSEXngnD23oFo3RRF7+iwitRq7iDt9F5xbjVjDdsTHnpoQz0uM3aGy6nncVAvdden3nrkZuY6drudxfRYJBZiEIA+cs+daIKdeiKzPyHY3dhF7+tSzGvH559xeD6e0Hfnx+3YetdZWfz1mEXtWPY8zPx5ohiAPnLNtj2OmnCff2rz9bY9jViM+/3XmuQ0dnNJt2hmR345Yw76+57ntmEXs6XoeJ8gDzRDkgXN23eOYbuQa9s0xyL/KuDVtRnxsmIMpQnzfqR/b8cr4k1XP465HrGFf1/M4C90BzRDkgXN23eOY1kbk+66cfArX6TcHdTViDdrrWbqx3wN92+pv0t6e7VONgPc9727HLAJgCEEeOGfbHsesRq7hoT6LSbU2Kj/myv7XmW6BLWjNFG31fd+/2zGL2NOlf4fAFEG+G3Ds9Ug1AAwmyAPn7rkR5ylDc9Jee32fEPE2Zbu6sWxGfGxo2dgh/jLJ657HTtUds+p53FQ3+Iacb6/HKgJgKEEeOHfPBedXGTekPtRakN/2PG7MUfmPsa0TyzR2eF4POHY7Ug0PrXoe19oK+jqHgKYI8sC5m2NwXo1cw76v6XeBOmaQ/xpz5Vmem7TTVv8l082PX/U8rrUgb8V6oCmCPHDuau+V/tB1nm/3n3p/+z5hYjVyDVcjPz60ZjPy46/Sv61+M14Zf9Klf02tBfnrMYsAGEqQB85dayPySXs3F/oE+Vex6B2c0mbkx18POHY7Ug0PrXoed5tpgvxF2ruxANCLIA+cu+s8P/966iC/7XHMauQa9l2n3zZ0Ywb5JPkw8uNDK37LuCO8Fxm27dxUIXXV87jtiDXsG3Lu345VBMAxBHlgCZ67SH2dYVsQvdS2xzGrkWt4qM+o/PcZd2HAj+l3QwHmbuybVu/Sf4u3Kden6HtzobUbC7qFgOYI8sASbHscM+Wo/Oc83yXwdopC9mx6Hjf2qPzVyI8Ptd1k/NHd9YBjNyPV8NBl+t9c2I5Yxz4L3QGzJcgDS7Dtccxq5Boe2vY4ZuzQvO9z2miv3/SsA+bqauTH79L/RuCUbfV9zx23EeQBniXIA0vQ4oJ32x7HrEau4aFNj2O+y/jTEK5Gfnyo5Sbjj4C/H3Bsi2312zGL2DNkobvtiHUAHEWQB5bga8o+yU+ZupW9zwX0lCPySTvt9ZsYlec8jT03/iLD2uqnWmCyS/9tNbfjlfEnq57H3cTWc0CDBHlgKVrb8u06z4fVqRfhu87zNzySYSN+x7qa4DlgSrcZfzR+yCJ3XzJdQB1y82+qLgFt9cCsCfLAUmx7HLMauYaHtj2OaXFU/nXGf602MSrPefmQ0h00pqsBx0653eO653FTjn6veh63HbEGgKMJ8sBSbHscM3Vo7jPytB67iAc2PY9bj1jDztUEzwFTuMn4v8+r9J/zfZvpRr679G+rn3LOft/pVNsxiwA4liAPLMV1nh/hfZNx90l/aNvjmDeZtr3+a5Lfehw39p7ySbmpYP9mzsFVY8/xMeN3B+wMuUG6HauIB4asoK+1HmiSIA8sybbHMauRa9jXNzS32F6fTDNXforngDFNsVJ9l2ELdrbYVj9ll8Cq53FTdggADCLIA0uy7XHM1KF52+OY9cg1PPQx5aL6OeuR60jKaNivEzwPjGU9wXNcDTj2U6YbZe7SZlv9qudx2xFrAHgRQR5Ykm2PY1Yj1/BQn4vXqdvrk/6L3q3HLSNJGZXvc2MBWvNbxg+DXcpUl74245RxUIt72ndpbys8gMEEeWBJrtNvy7e+2xKdwnX6bfm2HreMb2x6Hnc1Yg07X6PFnvm5TXtbNU7R5r9vyFz01trqp9yeD2AwQR5Ymm2PY6xeX1pv+9xgmGIrusTCd8zPh4wfBLsMG42/GqeMg96l/yr6U7bV9z2/b8csAuClBHlgabY9jmkxyE8VmPf1XRDraswi9qyjxZ55+JL2Vqq/zbSj8esBx04V5C+SfNfzWAvdAU0T5IGlaXFO+uc83/KftLvo3dtMc5PhOvaWZx6maKnvMmw0fsqV6rv0D8wtttXfxog80DhBHliar+nXMt7iqPwUe7fv+5r+F9hXI9ax70O02NO2XzJNCLwacOxt2txyLmmzrd5oPNA8QR5Yom2PY9Yj1/DQpudx6xFrOGTT87ipRuWTcjGuxZ4WTdVS32X4aPzXcUo5aEhHwpQ3GMyPB86GIA8s0Zzb66devX2bfnUl043Kf830NzSgj3WmCcxXA46tMRr/quexN5luT/t36V+XEXmgeYI8sETb9BvRnbq9vs/F9uu0WVcy7aj8x5QWZmjF3zNNKF1l+Er1RuP73/z7LdO+XgBH+csff/xRuwaAGj7m+cWYvmTaPeW7JP/ucdynTLuCfZd+dSXTv2bblBsIUNOU78lt+v/O32TazqJVkt8HHP//Mk1ovkjyvz2P/SHTru4PcBQj8sBS9W2vnzKUXqffQnxvM31dv/U89k2mbXs3X57abjJdl8y7DLtxdTVSHY8ZMhr/a6Yb+R7y89FWD8yCIA8sVd+LtfWYRRzQt9V06rnyQy5urzLd6vpfM213Ajz0LtONKg9pRf+UaUeWu/Tfci6Ztra+50tt9cBsCPLAUs15G7qkzNbvBMMAACAASURBVJHtRqzjoU36j3y/zrQ3Gj6ntMPC1H7IdIu1vU95b/V1NVIdp3i+L5luZfgupVOoD6PxwGwI8sCSbXocM/Xicl/Tv439asQ6Dhlykfs+099osPgdU/o1040qdxnetr4dpZLDugzfDm8qQ143QR6YDUEeWLK+F21Tj8pveh439aj8kIvvVwOPP4X3KQEGxvYp00672aT/1mm3mX7qzZDnu8m0bfXrnsdNOWcf4MUEeWDJrtOvvf77TDfnOyk3GFrbuz3pv9f9zneZfv76Ov1+pnCsL5n25t4xC9xNGUgvMuymxmacMg5ax97xwJkS5IGl2/Q8bj1iDYdseh439aj89cDjN5n2JkhSbh4I84zhNuX3a6qgfJFhwfdL6nTCDOkWaHHv+NsI8sDMCPLA0vW9eJu6VXUz4NirkWo4ZGgon3rhu+R+JXthnlOaOsQn5b3dNyQn07/XLgY+54dM9/p16d/JsBmvDIBxCPLA0l2nX+B7nWnbxK9T5uH28X2m2Vd+nf6rP+/7R6bd9z4R5jmtXYifaoX63D3fjwOO/yXTLnCXDBuNT6YNzFcDjp26iwHgxQR5gP4Xl1OPdg25uBz7QnSd5J8v+P7NacoYRJjnFGqE+KEt9TeZfheLoaPxv2b41JxjXaT/OgZfMl1dACcjyAP0v2D+LtPORx+y6N3bjNcxsMnLQnxSRvKvXlzJcMI8L1EjxCflPTdkz/h1pl9x/UOGjcZfjVTHIUM6BYzGA7MkyAMM27u95bnyQ47t4yLlZsKQ/aGfUqPFPhHmOU6tEP8u5aZhXzVa6rsMOy9MORqfWOQOWABBHqDY9DxunWlXYd8MOPZ1TjfqdZESDoYEij42mX4V+0SYZ5haIb5L+y31OeI5hx7/Euv072b4GHvHAzMlyAMUfdvYX2XaPaSvU0az+nqflwfly7vnPWZhu+fUarFP7sP8kNeT5blJnRCflBA/pF39XaYPoqsMG43/JdOOxl+NdCxAUwR5gHubnsddjVjDIZsBx74aePxD71JG4oeEiaF+zLQ7AOz7mjJiJ8xzyJeUG1k1QvxV+m+XliQ/pV6dfd0OPP6lVuk/Gv8pFrkDZkyQB7i36Xnc60w7Kr9N/63oktIOvzriedZJ/ifjhvid1QTP8ZR1kh8q10Bbfsv0+8TvrFLWkOjrU+qMJr/LsJsNU+4bn9hyDliQv/zxxx+1awBoycf0mxf+KdOG0XWGrRx/kzKy2Pci+kOG7Vn9Ere5b9+vbZXyM5/i5gXt+iXTL2S506WMrPf9Haz5/rlO/xHv25S/21RBfpXk957H3mTaHUgATs6IPMCf9R2lGXO7t0M26b8VXVIutvsGk02mC/FfUl6364me7znblFBkEbxluk3pzKgV4nc7Qwy5kbROnffPVYZtifc+RuMBRmNEHuBb1+l3wTr1qPz7JD8P/J7/yuPzaHchYkir7Ev8ljr7XfdxkXJxf6qt9mjfTUqreI155jubDF84rsZNh4uU82LfGw67tQamcpnkXz2PnbpTAGAURuQBvnXV87i3mbY9c5NyETr0ew7ZbS83VYj/e+qssN3XbhG8HzL8NWZ+fku9Re123mdYiP+Uep0DHzKsa2DqOoc839Tz9gFGIcgDfGuT/mHuarwyvvE1w1tC3xz4nl2AGWN7uYduU7oC5tLKuon95s/Zbdq4qbTOsO6a20y7wOa+VYbdcPgt5SbhVLoMq28zThkA0xLkAQ7rGzy/z7Sj8scE4h9TgkNSLsq3GTbX9Vifcr+Q15x8TrnZ8VPtQjip3foMtW8qXR5Rwyr1bjxsBhx7m+lH468GHPtr2lmfA+BFBHmAwz6k3VH5Y/ZA/2dKQP0906zQ/kvqho9TuErytwxbZJA2/ZT6rfRJubG1zbD34A+pV/dVht30+5Bpg3KXYaPxV+OUATA9i90BPG7Ilmz/mekuYLsk/57ouYa6TRn9/1i5jlO7yrB9vmnDl5Tfx9oBPrlfl2LIlJZfc99NM7Uuw84zUy9wlwxbLLDmawlwckbkAR43pP31aqwiDrjOcaPyY9u1Lp9biE/Kz/e/UqYL0L7dXPgWRuGT40L8p9QNnpuBx0/dUr+K0XhgwQR5gMddp39gnnqu/NWEz9XHrykX1i2EprF8Tvk7Wtm+bb+mvBdrz4XfOSbEf0m9xe2SEsqH7GjxS6Zd4C4xNx5YOK31AE/r0r+9dOrWzU3a2Pf872knNE3lIiXsvM80aw7wvE8p4W5bt4xvbDLsfXqb0klwPUYxPXQpN636/l7X2Jd9lbLeR19TTn0CmIQReYCnXWfYqPxqtEq+dTXhcx1yk3ltLXdKX1Ne/8u0Oc1hSW6S/Hfud2RoySbDQ/wqdUPnJsNuTq0z/aKWVwOONRoPnCVBHuB5VyMd+1LXqRciP6Wd+cc1XacEmf+MQD+1m5RpDl3aXJdhk+EdM+vUfU8Nban/LdO/9qsMq/FqnDIA6hLkAZ53nf4h7W3Of1T+p8x/a7lTu45AP5X9AL+pWsnjNhke4n9I3RsSXYadT3Y7VExtSAeQ0XjgbJkjD9BPl/5z5T9lujB/meRfEz3XuW4tN4YuZXRzHXPoT6XVOfD7LlLeH0NGjJMS4jcnr2aYzxm2IN9/Z/pzwTrJPwccb248cLaMyAP0c51ho/Lr0Sr5s4uJnme3R7QQ3891SpDvUhYDvKlZzIzdprzv/jNtzoHft1udfmiI/yn1Q/xVhoX4X1LnXHA14Fij8cBZMyIP0F+X/qPyN5lmO7p3Sf5n5Of4NSWUaqV/mVXKDZ4Wdhpo3ZeUFuqPmcfv3TFbzCXT73RxyCrDVoC/SbmpV2OBu3/0PLbGSvoAkxLkAYbZpH8QG7td9tjwMEQLLb/n5iLlBsz7jPuzm5ublOD+IfMaSb1MeR8OnULRQoi/SGmpfz3ge/4r0y/Id5HyO9H3Nf4pFrkDzpwgDzBMl/57LI85KnSZErDHCoI3KWFz6avSj61LeZ3XWWao34X3Teb5u7ZKqX+OIT4ptX834PhaAflDkh97Hms0HlgEQR5guKv0b/Ec48L32BHAvj6lhEsXwtPajdS/SwmI57pI3m8pv78fM6+R94fWGbbw2k4rIf59kp8HHD/lIp77uvSf0pToIgIWQpAHGG5Im+dtSvC+PtFzr1NGp8YKeVpS23GZEpx2H3MM9rcpI+3bvY9zMGSEeF8r76+hu13UHOXepv8CglOtTQJQnSAPcJyr9B+VP9UI3NARtCFsLde+ywcfQ1dHH9sutD/8OCfHbi+XtDNSfMy8+L+lzk2YoYt51qoTYHKCPMBxhi6+9NIFojYZb7XzLykXzNcjPT7j6e4+LlN+J1d3X7/MOCP4Nym/J19Tfp+v7z4+5/ynYuy2XxwSgHdaCfHJ8C3yanYRXKf/612r9R+gCkEe4Hjr9J8je+xF5ktGAPuwtdz5Wz3480VKKD3kOt/e0Dn0taU5thumtU6Xq/TvJErqhuOrDKv1P+P3FFgQQR7gZa7Tf8RoaNtnlxIAxlrNvKVRQmjRRcp7ZMjK7ju3KSG4lekFQ9vUa+0XnwzbHSRpZ+0BgMkI8gAvM+TieMhCTGOuTG9rOXjeKiXEH9NK39p0laHnk9o3Ibbp34Vkuzlgkf6jdgEAM/cxpf20j9fpt+jdOmVF6TFC/KeUi3ohHh53leT3HBfif0sJwdenK+dFdtNzhpxP3qfeOeJdhk0lMjUIWCQj8gAvt0q56O/judGjY7e16kP7KTztMmUU/tjpLL+kBMuWfM6wv0/Nv8PQFfUtcAcslhF5gJfbpv+o/KscvkjejZqNEeJvk/x3hHh4ylVKJ8wxIf42Zc2J1kL8JsP+Pr+l7t/hKsO6INbjlAHQPiPyAKexyrBR+cvct95epNwMGGNRu9bm6kJrVimdMMe+/76kBMrWpqtcZdiq719SXotabeqXKTdS+tJhBCyaIA9wOtv0n9v5JeXCdcxF7WwtB4+7SAmCL+mCafU9tk7/rTGTb28u1jBkCkDNFfUBmqC1HuB0NgOOfZMS4LcZJ8T/kHIx70IXvrVOCa3HhvhdK/067b3HLjM8xK9SN8RfZVhHxDrtve4AkzIiD3A6F0n+t3INtpaDx61SQuOQVdEfarWVPjmuw+eHDLsJeWpDW+p/SznHASyaEXmA0/macpFZi63l4LAuZTHJ3/OyEP9T2n2PdRke4v+euiE+A5//Nha4A0giyAOc2rbS8/6UugtVQYu6lKD47yTfveBxbpL8Le0urnbMXvG/pizyV9NVtNQDHEVrPcBprdJ/9fpT2I1QfZzwOaF1FymL0L3Py9eg+CUlcLYaII/Z9eLX1B/ZHtpSb894gD1/rV0AwJmZ8mLf1nLwZ11KeF/n5QG+5bnwO8eE+N3fq7bNgGO11AM8oLUe4LSmuuj/NfVXmoZWdLlvof8xLwvxtylzx1udC79zbIhfjVHMQB8yrO6rONcB/InWeoDTWmX81vraq0xDK1Z5+Sr0+1rdF/6hl4T42n+3VYadI7XUAxygtR7gtC5GfGxby0F5j61TAvfrEz3mp5QbAtsTPd6Yjgnxu73ia4f4i2ipBzgJQR7gtFYjPe6nlBBf+0IcalmlhLrvT/iYNykBfnPCxxzTnEN8Ul7nITdf3kdLPcBBgjzAab0b4TF/SrvbXsGYupTwvs7pRt+TEm7fZz4BPnlZiG+hi+d9hm0B+Fvm9fMBmJQ58gCn8y7J/5zw8WwtxxJ1Ke+ldYaF1j5uUxZa+5A2Rqj7mnuIv0ypv+8ihLcpvwdz+hkBTMqIPMDpXJ3wsWwtx5Jc5r51/tThPSkt9JvML8An8w/xu3nxQ3YSMI0I4BmCPMBpvM/pAshcVs6GY12kBM13d59P2Ta/b25z4B8aOpKdtBXik+Fbzf2SeSw6CFCV1nqAlzvmYvsxtpbjHO2C++5jjFH3fZ9SAuScp6WcQ4h/n+TnAcd/Sfl7A/AMQR7gZS5SLppfOqJoaznOyWXu2+UvM35wT0qI/ZgyAn89wfONaZ1yI2LOIf4yyb8GHN9a/QBN01oPcLzd3NWXhnhbyzFXF7kP7ZcpC5S9nbiGL7kffT+H99DQUeykvRC8OzcO8T7t1A/QPEEe4DjHLEB1iK3laF33yMfUgX3fTUpw/5D5j77v2yT5fuD3tBbik+FTAn6NKUUAgwjyAMOdIsTbWo6HdqPbfXzNsOC2euTr3d3HzuVdHUndoH7ILrxv0lZoPYVjzykthvhNhv09vqSMxgMwgDnyAMNcpoSJl7TT21qOfaskv9cuolHnHN53jj2nfEm5GdjS67JO8s8Bx9+m/P2vxygG4JwZkQfo7xSr09tajoeuU34vploUrmW3Ke+xbUq4va5YyxTWGRZ8d76k3ABq6TyyyvC/yzrn/zMGGIUReYB+1jnugnufreXoY5U/r/o+1h7rrfiU+/C+rVnIhC5S5vcPnQ+ftBnij7nJaX0QgBcQ5AGet87LQryt5XiJ3dz5Ve5D/ku6Qmr6kvI++JwS/Jb4nrjM8HnkO7+mnI9acsz8/t9SzokAHEmQB3jaJseNmu3YWo4xdHcfq9xv+9ZSW/5NSsv0573P23rlNGOd4fvD7/ySNheF+5zhi9ut4pwI8CKCPMBhFykh/rsXPIbWUaa2v/L9au/rqwfHHTuqvwvoO9u7z7tV9Ieupr8ULz2ftDotZ5NhNzpbXGUfYJYEeYBvvXR7OVvLATurlMB7zFoHLQffTYZ3K/0tOjMATuI/ahcA0JjLDG8V3fcl99tJAcu1W9Du9xwX4nfnkhZD/DrDQ/wPEeIBTkaQB7i3SrnQPHaV8F/vHuP6JNUAc7VKCeA/Hvn9LZ9L1hm++OevaXNqAMBsCfIAxTpl5OzY1cB/uHsMCzjBcr10FD5J/p52zyXrDA/xv6W9lfYBZs8ceYBy4X3syJmt5YCknAc2Of5m4O3dY2xPVM+pXSb518DvsUI9wEj+WrsAgIp2o2fHbi9nazmgSwnwb1/wGK2fSy4z/AbDTYR4gNForQeWarcy/bEh/qe4SIUlu0jZXvLfeVmIb/1csgvxQzoNdt0Frf6dAGbPiDywRLtV5Y/dDmodq9LDkq1TunmObaNP5jEt59gQv0rbfy+A2TMiDyzNKsevTG9rOVi2VUpA/WdeFuJ/Tbtby+0cE+ITIR5gEoI8sCTrHL8yfcvbQQHjWqWE2t+TvHnB49wm+e+0uyr9zrEh/ocI8QCT0FoPLMVLVqb/IfZAhiXqUubBH7uWxr7dNmwtB/jkZSF+c+piADhMkAfO3UtWpp/DHFbg9LqcLsDPaV0NIR5gJrTWA+fsJSvTf0r7c1iB01qlBO5/5zQh/peUmwJzCPHrlH3ihXiAGRDkgXO1C+HHzGdtfTso4LTe5X4O/HcneLwvSf6W5H3mcR5ZpyzgN5QQD1CJ1nrgHK1SRsCGjizNqQUWeJmLlAB/leN2sTjk9u7xPpzo8aawjhAPMDuCPHBu1jnuovRLykX99SmLAZrTpYyUr/OyLeQe+jXzGYHf2eS4KQRCPEBlgjxwTo5dmX6OF+DAMOu7j7cnftxPKeePOa2n8ZJFQIV4gAYI8sC52MRFKfBnlykh+11OO/qelF0t1ilz6+dktwjoMeuHOF8CNEKQB+bu2ItSW8vBeepyP/p+qrnv+25S5sFvRnjssV2m1C3EA8ycIA/MWZeyMN3Qi9JPKSFeKz2chy7lPb3OcSG1jzkH+ORli4Cu4qYnQFMEeWCuLlNG4odelP6UcjEOzNtlSnBfZbzwnsw/wCdlesHPR3yfEA/QKEEemKNjQryt5WDedtvFrTLOnPeHvqQsCLcZ+XnG9JJF7b6knDOFeIAGCfLA3KwzfHs5W8vB/FykhPbdx5ij7vs+pYzAbyd6vrF0OW7qUVLOmauYfgTQLEEemJN1hod4W8vBPFzefazuPk8V3JPSsfMxJcBfT/i8Y1nluPnwiXMmwCwI8sBcXCX5x8DvscoytGmVEta7u8+n3tu9r137/MecT3C9yvBz5c4vKSEegMYJ8sAcbDJsjqet5aANq5Sw3u399xhbwg2xG33/kPM6R1yk/L2OvSnixifAjAjyQOs2GRbibS0H01qlhMjdCHt3999jL0Y31G8pQfecRt93Vjm+ld7K9AAzJMgDLfuY5LsBx9tajpouU24iPbTd++/rzG8O9qGQvvtaa2H9oXNsnX/oQ5Ifj/xeC4ECzNRf/vjjj9o1ADym7zZztpajBeuUUNU33H66+3yd+yD1NX8eGd3/f6fW3X0k98F8/+sXmXbBuVM555H3fZcpHUvH/owsagcwY4I80Lp1nl6p3ogSrbk88HHqketPzx/yJ13qz00fy03KDb+Pd5+XEEzfJ/n5Bd//95SbTgDMlCAPzME6h8O8FZaZiy7fbq/Welt6q25TAvs2JbxfV6xlal3KKPyxC9qZDw9wJgR5YC6ucr+l0m1KgN/UKgZOoItw38duxP3z3uclep9yHjz2d8RCoABnRJAH5mSTEnbWWe7FPOety7LD/U3Ke3s/tC89eF6mtMEfOwqfWAgU4OwI8gDQtt1CdLuV48eadz+lm5SW+G3uF/Tb1iqmYVe570Q6xk3KKLwbnwBnRpAHgPlaPfi82xouedkI7kt9SRlJv7772K3Gv/szT1uldCC9ZIHC31K6l5be0QBwlgR5ADh/q2f+fIwpt8pbii6ljf67FzyG7TgBFkCQBwCo6yJlMbv3edmUiU8pIf765SUB0LL/qF0AAMCCrVM6G/6R40P8bcre8KsI8QCL8NfaBQAALNAqZTG7l65lYBQeYIGMyAMATKdLmb/+e14W4o3CAyyYEXkAgPF1KSPw35/gsaxID7BwgjwAwHi6nC7A36QE+O0JHguAGdNaDwBwel3KXvD/zstD/G2Sn+4ec/vCxwLgDBiRBwA4nS6nG4FPShv9+5gHD8AeQR4A4OVWKW3vpwrwX1IC/PZEjwfAGRHkAQCO9y4lcL90G7md27vH25zo8QA4Q4I8AMAwFymj7++TvD7RY94m+XD3YTV6AJ4kyAMA9HOZEt7fJXl1wsf99e5xBXgAehHkAQAed5H79vk3J37sX1MWxrs+8eMCcOYEeQCAb61S2udPPfqeCPAAvJAgDwBQdCnhfZ3TzX3fJ8ADcBKCPACwZF3KqPs6p2+d3xHgATgpQR4AWJou44d3q9ADMBpBHgBYgsvcz3sfK7wnyU1KeN9EgAdgJII8AHCu3qWE93cZZ877vk8pAf7jyM8DAII8AHA2dqPuqyTfTfB8tynB/SrmvwMwIUEeAJir/eC+yum3iXvMl9yPvmufB2BygjwAMBeru49dgJ8quCdl9H1z9/F5wucFgG8I8gBAi1YpgX33MeYCdU/5LSW8m/sOQDMEeQCgpu7uY3X3uWZo3/mU+/CudR6A5gjyAMDYLpNc7H1e3X2uHdj3fcl9eL+uWgkAPEOQB4Dnbff++2v+PEd69/+us7wAuLr7vAvpyf0Ie5K8nbacwX5LCe5G3gGYlb/88ccftWsAgNZtUvYi77u42pfcB8Pt3tf3//tz2guPXe5D+G70/NB/T7nI3Cnttov7mPKzaO31B4BeBHkA6O8yJdC/y2nbwm/z7UrojwX9hx0BT+lyH8z37Qfz1lrcT+1L7sO71eYBOAuCPAAcp0tpLX+X5LuqlbDvJvcj7tsYdQfgDAnyAPByuwXc3t19fl2zmIW5yX1o32Z56xQAsECCPACc3mVKoN99zHVOeYu+5D60f47gDsACCfIAMD7B/jg3KWH9c+7DOwAsniAPANPrUsL9LuDPeSX4U/mS+xH2bdpc1R8AmiDIA0AbdnuxX+Y+6Hc5r/n2u235diF9mxLcr6tVBAAzJMgDQPu6u49d2E/+vIVcl3qB/+HWedu7z/vb5G0DAJyMIA8A56nL4T3kX0rLOwBUJsgDAADAjPxH7QIAAACA/gR5AAAAmBFBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAAAmBFBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAAAmBFBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAAAmBFBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAAAmBFBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAAAmBFBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAAAmBFBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAAAmBFBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAAAmBFBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAAAmBFBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAAAmBFBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAAAmBFBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAAAmBFBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAAAmBFBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAAAmBFBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAAAmBFBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAAAmBFBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAAAmBFBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAAAmBFBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAAAmBFBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAAAmBFBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAAAmBFBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAAAmBFBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAAAmBFBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAAAmBFBHgAAAGZEkAcAAIAZEeQBAABgRgR5AAAAmBFBHgAAAGbkr7ULAAAAFu0iyWWSVZJu7+N1j++9SXK997FN8jnJ15NWCI35yx9//FG7BgAAYFlWSd7dfX4zwuN/SQn12yQfR3h8qKrVIN/dfST3d9eW7jLlbmXiLuNj9l+jQ7YT1TFHXbzn+tr/PbvOcl4r56CXWd19/pry+i1Bl/vzyhJ4XxSr2gXs8TNpz2WS9d3Hqwmf9zYlzH/Ics7B52J14Gve22kzyL9L8j8PvvbfWfadtA9Jftz7823KifC6SjVtevgaHXKT8g/HduxiZsZ7rr91kn/u/fk25R+Yc78oePj+8l7qr0uySfJ272s/3H3tnK2S/F67iIl9Sfl7L/nicpPk+9pFHHCbcp7+nHLt9DnOX1NbJbnKn8+FtXxKqWVbtwye0eXbfz93XIekzSC/zbc/sE9p6w7v1A79kH5KOQlR9P1Fvk05MSz5Quuhbbzn+vqab0cQfk35x+ScPfb++s+4ofic63w7x/Mm5z9S/THJd7WLqGAJN2ke0yX5d+0iBvqU8rv6Mc5lY7lMuRl8TIDfzX1Pvg1sXe7Po8feHPiU5H3O/2b8XF3n6TUSFn9Nb7E7luZVyj/Yq8p1ME+H2gC7qYtoyLuUCzQOe5d+CzUBdby9+/g5paNic/ex2GBwQhcpA07PdUvu3OZ+PvsxHRNd7hfL63vufZvkXzE41qJVnv8Zvkq5EXM1djGtsv0cS/Q25Y0P9PPrI1/3Pnrau0e+vpmyiEquUi7Ml+RLlj0l6TplhHOu3qQE+v9NeY92NYuZucuUIN4nxP+aMp3vIvc3h7dHPOd1yvvvfcrP7r/uHrvPeegfKTcPuiOel3Fc9TxuPWINzTMiz1L9nPu7vsDTPubwvNfXKRds3kffusjjc4U3E9ZRy+eU342uch1T2tYuoAHvUi6sDy08O+biVF3+/Lu2uvt8meMWVPv+7uOXlEBhhL6/dUoYf+p1v7075kPGe20/5/538f3dx1M1vbn7nnfxXq6tS//pEq9Tfs6bkWppmiDPkm1S/pEHnvYxZa7ioTa391n4HfFHrB/5+qcsZy7udZbzd6X4mvam2+zvT36ZYWs3/Jj7FdaX3G3R1zp/XhD2j5hy9wAAHWxJREFUkKlvjny9e74Peb7V/1XKIp1/izBf09XA49dZaJDXWs+SvUl7FxzQqs0jX3+sfXzp1o98fTNhDUAJctuUcPAuyV9SWrkfmzL00KuUnV1cLzxtnadD/E1KQH6fOh0OX++e+295vt3etLF6dlMsHvp7ynv30M/vbRY6MCfIs3Q/xsJ30Mfmka+/ihH5hy5TbhQ+dBtBHlrwMeW89f9SFjrrM4/6x5QbAoemDSzduzwd4n/L/bz52rYprdtfnjjGVIp61jm8O9DuRto2h0fsF3nzRZCHcmHtH2Z42nUeX8jKqPyfPXZBsZmyCOBZu7brLv0C/dsI8w9d5ulz268p/0a0FI6/ptR9qCtjN3+fOg79+/nw57HJt+/V77OsNVmSCPIsw02eXkn3dVxgQx+bR77+XRb4D+gTlrxaPczRLtBf5umR2qR025gvf2+TxxeR+zVtd2ytU1q2f0q5Tvwt5d8yC7jWsc63a/F8ybc/j685/B5cn76ktgnynLsfUk7Kq5R5NY8F+u+ywBMADPQxj49YGZUv1jl8UXvoYgRoy3UeH6nd9zYL3rt6z1UOTyNKyvXWerJKjrdbBG+V9joHlmZ94GuPdUcc+vri2usFec7Zb/nzCNg25UT92N32DzGqCE957C54ssB/QB+xfuTrWjVhPtYpq6s/5R9Z9ho7XR4/79/GzV2Gucy3W87d5vFrjs/59np+cWv2CPKcs8dGv9aPfP1VtL7Ccx4LpLs95Zesy+G9b5+6GAHa9D7Pj8wv+QbdVf5/e3d/1UiO9XH895yz/0MG1EYAGwGeCJqJgJoImo2A6giGjmBEBOuOYEwEayJYE8GaCOb5Q3ihjW75rUqll+/nnD5zRkVjQdtVutLVlZ1S34qVbRwmNCnk1P8+Cn3+uiE6kwsCedRoKb8nKoR0OaDfUr7uREjtq/LWzz8Xg1ogR618dp/lUpWtAL5p5IuLhTyJiUsc5lzh99OuiTKnz9v9LlRRpgyBPGr1IHu//L1YWQT6WA/X2lMpKXIHlKdVfzX7Gicw+37mLlYnUIzQ++lJvmbFLm7P71ckAnnUrJX9cHbieBnAYq22VLc/7YMbfa62K/nshUXcrgAY0Fr9gcGl6pv8tyYtn8T9Dofb58g5S+jrqjlJh0AeNVvJDjouxawyYFnJTjetdVW+Ndpr3kMLlMLJ3lIk1TWBeaXwpKVE9hEO1+pzrYUX7b89Y6XweKSKVXkCedRuLjsg+ap6gxJgF+shW81M+Afn8j93iIvYDwDj6XquzSL1IQV94yL2xuNQVpG7Q4S+vlUFmbUE8gAp9sAxnDhTfqM12h9FkTugFE72Pe9S9YwVZkb7s7jf4TAz+c/OtkMz2eb6nDFTxVY/AnnAP3iswIMj6QCbM9qrSGn7oK9aPYBy9H2ma9knb/2ci5idQBHaQNuxE+Ch4L/4sQiBPOAtJH03rn1RBTcD4AjOaK/pTPmZ7CJ3BPJAWRY912aR+jA16+z4VcxOIHuNwkfOuSO/X+jvXajwDEECeeBdJ58aZl1rYnUEyMRS9memlsmv1mh3EfsAII5Fz7UaUutnPdeWsTqBIoTGCM86PrNjLb+av8/rFINAHni3lj0oPxOra0CIM9qLngV/cy7Ojgdqsuq5VksWEnCqc4XH26ee8hL6+9cqeCGOQB742VLSN+MaR9IBnzmjvYZCMzcKp5n+EGmmQKmepu4AkLnQs/NVpy+YWVmC3YnfN1kE8sBnnex04XvVsw8O2IeVziaVvypPkTsAAA7TBdrmGubUg9Cq/K0K3fpCIA+E3Ygj6YB91XimfKPwsTmvIq0eAICQmcIFYruBvv9c4fF7kXvlCeSBsJXsm8qFTt/HA5QkdIbrRqmr8tagwMXsBAAAGekCbU8abjvaWuHncDvQ908KgTxge5Df6xpyq3IDFOAY1qp8kbPgsgcFTPIBqBHF/rBLI198bpsb+HVCz+ELFRjME8gD/VqRYg/swwpgSzxT3ipy9yyK3AGoUzN1B5C8LtD2ouED+ZXCRSnbgV9ncgTyQD+OpAP2s1I9Z8q3Rjur8UD5QiuK0jCFulK36rk2i9QH5Mk6rtWN9HrWUXSzkV5vEgTywG5zSd+Na9cqL0gBjmUFsiVtQ2nki/htG+LoHABpa3quLWN1YkKrnmuXIksRtlbhTDY30utZtXvakV5vEgTywH462cW8OpWXOgwcw6oWW9KZ8q3RPtTROQDS1fesX8XqxMSszCuprElbDCu06PWocT83LtB2q4K2gRDIA/vZlWLvovUESNda9qp0KQO81mgnrR4oX999rIYVean/5yRDESGtwkfOuZFf13outyO/bjQE8sD+FpK+GdcuxUAekOwHcwlnys8UHow8q55BPFCzmdH+qnruAYuea5cqbA8yBtEG2l7U/14awlp+1X9bMRNOBPLAYTrZaWVfxQMMWKjcM+Vbo91F7AOAadwoPJEn1VUfY9fP6mJ0Atm4UrhAZBfp9V2grZjtfgTywOFacSQd0McZ7TnPgp/L760LcRH7AWAaffevmgL5taQfPdcvFC9IQ/pCn5uYxWEXCi/AdZFef1QE8sDhlrJvABdiUA84oz3nM+WtbIJHUeQOKN1M9rFzL6orkJd2byW8VyErnjhJo/AEeOzisKH364UKyKIlkAeO8yDpybj2RfmnEAOnWMlescl1Vd7qt4vZCQCTcEdeK9VC9hho4w8RzNeuNdpj15SyTtTJdTzyPwTywPFa9afYN7E6AiSopOr1V/JFnLbFKNYDYFoPsvfGv6jeQrfdHl9DMF+3UKD8pPiFIa0TdbIvwksgDxxvJY6kAyxO5Zwp3xrtLmIfAMTXyheytXSqd2vNQtL3Pb7uDxWyHxkHaeWf99tc3G78T2e0Z70qTyAPnGYuO4X4Wjy8ULdSVuVbo91F7AOAuFr5INTyJO4BneyTfD66lw/8KQZcD6vInYvcj42VwttBWmX8viSQB07Xyj5u6175FvcCTmWlnOaUztYqvKrwQ35gAKA8d+oP4l+V34TkGNbq32b40bX6MxlRjpnC29Gm3obiAm05Zgn+D4E8cLrNg8zilPFsH3CCpfI/U7412l3EPgCI41w+k+j3HV83U70p9duW8r+PfYL5M/kJkoVY5ChZqsVhncJjkmzT6wnkgWEsZO8VuxQp9qiXNQOfw4OzUfjIqZhn4AKIo5VfMf6y4+t+U/xiXak7JJiX/H3136IwcIkahT9DqWSxuUDbhfJZXPgJgTwwnDvZe8W+qoDzKoEjOKM9hzPlW6PdRewDgHG18gHGHwpvo/noN/H5tyzl7+n77JnfuJX0H/nf6Wz4LmEC1iT91Gn1G85oz2Fx4RMCeWBYbc+1uUixR33WyvdM+dZoT2VAAuA4V/Kf47V8AG8dL7fxKukfIojfZSX/u92nmv1Ht5L+lJ8MaMVYKVfnCj83UzqqdSXpMdB+rQyzQwjkgWEtJX0zrnEkHWrljPaUU9luFB7cPymN9EAA+2vkP9MP8p/ff8tnyu1agZf8Z74R6fSHuJP0i+waKZZL+YmV/8o/N1J+RuCzG4U/U6lNfjujvYvYh0H8beoOAAXq5FPEQntrv8g/4FK7qQFjmsuvaG0/4DfVYl3k/uzDGkC6mJ3I2Ln8CkyocnEpnkXRM8tswtdu3v6cy68OX2m/gH3bi/zz3A3Treos5P8d7uR/j4f+G9y+/XmRf4Y4MZmSui7QNuWRc5aF/Ptqe7L+Vv79ms09nUAeGEcr/8AJPbg6+YfSKl53gMk5+RWwbTdK7yF/Lv9A30aRu/09qOwgXvI/34MyPrpoBK36j23LAQH8sB7kf5d38u+PXdsYtl3IPzu+6j2oX4h7cWqsLLa50gyMO4XvVZuJpyyQWg+MYyV7/++ZeAChPs5oT/FM+dZoT3VAkqJm6g5E0kzdgYScK98g/lV+3+yv8v+mbsrOFGgtHxw18gUDn478Ppug/l9v33Mu9tSnIvUid9s2mYLb2sj9OAmBPDAeJ7vIF0fSoTZL2dWMU9sHmduAJEVu6g5E4qbuQEJSP4Vi25N8TZtf9F6ki0n28Tn5rRd/ly+Kd+g++o0z+YngzZ76pfy9uzm1gzhYo/B20melux1iMxG07UIZBfOk1gPjauVX50Mp9vfyN5FUb3LA0B5kp7KlEiRfKZwemPKAJEXu7b/NhH0Y20oE8ql61nv2zOLtv6utP5jWSv7efyc/mbv5c0w9A8kvkPz+9ueH/GeTiZk4OqM9lee65UHhbXStMrm3E8gD41rL3xD+ZVyfywcOpOuiBnOFA/nNmfIpBMqsxg/HTd0BJONFw78fWtn7reci6y0nc70H3UME9V/e/mzed5ujBjG8c4Wz6lIscrdtKZ+Zs51NcC2fNbKI3J+DEcgD45vLp4+FCn1dyA82Uj9PGxjCWn4famgGfFMIaUrWgERiZQc41ljV/Tv5+8bvgWv38kHEauDXxPiGDOov5N8Lm6wvAvrh3Sn8b+Mi9+NYTuFtAa0yCOTZIw/E0cneB/ZV6e0RBsZiBcQpfAasweKjGPwBxxqzSOSD/OczxI30mojnYzG7X+X/rUMFynY5kw/oV/LjMYrjDac12nPJYnMKv6dulcHWMAJ5II61+gMVJx4sqMNc4UmtzZnyU7Je30XsA4DD3Ck8EL9WGhOEGMYQQf0moF+K98YQWoW3t/xQXtkw1qRDG7MTxyCQB+JZylfIDeFIOtTEGe1TDqwahdPrXpRBeh1QsbXsgfiDmCQv0alB/YV87aK5eH+cojXaXcQ+DMEZ7clveyWQB+LqZB/Bda0MbhrAAJzRPuWZ8hS5A/LVKZzpcyGeq6XbBPWNpH/qsOPsvsgvsuR2dGIKrmRPfue2MLVS+LjoFDIFexHIA/HdyJ457sQDBeVbyVeKDZlqVZ4id0DeWqP9XhnsdcXJNpkZjaTftH9AfyGfdUWq/WFKm/y2+t3F7MShCOSB+Faybwxnyi8lCTiGM9qnWD27URn7/ICaLRReVZN4rtbG6T2g3yfl/kw+1b4drUdlaRQ+fUbK97O2kJ3VM4vakwMQyAPTeJC9InmpxGcAgQHMFR5gbc6Uj6k12l3EPgA4nTUReC2CtBo5+aDz+55f/4dYmd9Ha7TnfsKLtSqf7PYcAnlgOn0p9vdKeAYQGMBadtp6zIdmI79PcluO+/yA2q1kF5Wl8F2d1vLPlF+03+q8E1scdyktrX7DKfwembJ+Ty8CeWA6a/WvEDgx6EDZnNEec0WEvfFAWR5kH3HZxe0KErKQD8asgsMbZ29fy/grrJX/HW17li8cmLNUFhj2RiAPTGsun4oUciFSe1G2haY/U77UlQWgVpsV2JCvYrW1Zmv5bMd9gnkmc8NKf2b2nSmf3OQOgTwwvTvZ1VW/iP1aKJv10Izxvp8pXOTuSRS5A3I2l12HppSAA8fZN5i/FuOvbTP5Ok7bXlXOxMdS4fdGkkfREcgD09snxb6J0RFgAtbDP8aetNZodyO/LoDxUfgOlk0wv+uIOiZ9fmZ9ppzyLnK3LZuid7kE8s3UHQBGtpBdVZUj6VCylewjo8ZcDTk3vv+r+LwBJVjKfq5S+A5r7X7GXOzxNbVoFC4MK5U34eFkn6qT1Pshl0A+lPpYi2bqDiCaO9mpXtdKcCYQGMgUxWVuFC7Y40Z8TQBxdQoPyM9UXvCBwy1ln3Kw0UboRw6s53GpW9Gc0Z7UWDyXQL5mzdQdQFRtz7XfRZEelMkp/pnyfSmCAMrQV/juVhzzCj/Z05dib61C1+Rc9vi01Akx6+e6VkJj8RQD+dyPLgBOsZT0z57rTqQDokzOaB9j9vtK4YI9JRyfA+BnThS+Q79ux/VZhD6kzMpge1E5Re62rWRv+0tmVT7FQN4qltDE7EQGFlN3AKN5kD3ouBTn4KJMzmgfYz9aa7QzqAfK1Bntl0poUI7JOPWvys/idCNZndHuIvZhCs5ov1Uii2opBvKWZuoOTGQ2dQcwiVbhVGPJn4M7i9YTII6YR76Evl9Jx+cA+NlC0qNxrVMig3JMqu/+n0wq9QRuZNcqK33yey57gieJCcAUA/mF0c5N9merqTuAUa3UH7zMxWcC5XFG+5Cr8q3CKYJzlXV8DoCf3YnCd7C5nms1j7esgPVRdTwzrXtDG7MTlhQDeUuts2Ezo30VsQ+Yxlz2/hyOpEOJnNE+5Jny1qSA9doAyrCWnSJM4Tv01Ue5jtaLtDSyf3YXrxuTckb7hRII5lMM5BdGe62BfBNos44oQ3la2Sn2X5TATQQY0FrjninfKFyB+EXUHQFq8CA7VdZF7AfSZNUnqlVntD+rnmfmWva2nMnT61MM5KVw4NLE7kQiQvtSakhlgbdWfwDzoHo/GyiTM9qHeGC2RjtptUA9WqP9QhSTrd1q6g4k5Fz2+LO2Z6b1815q4kyeVAP5UHrLperbozIz2hcR+4DpLSR9N66RYo/SWMVlhjhTvjXa3YnfF0A+Fuo/VqqJ1hOkZjV1BxJyp3A9mRoLw1rFeKWJM2NTDeQXRvssYh9SMDPaVxH7gDR0sm8i12IVAWWxBgmnrMrPFM5w+iGynIDaUPgO6Nca7bUWhrXuC7eacPIv1UB+ZbTPIvYhBTOjva8gB8q0Vv+s373qrSOB8lgPzFP2ybdGuzvhewLI00r2feaL6htvAh+1so+c6+J1Iylz2TWr2oj9+EmqgfzCaB/yCKLUnStcKfJVBPK1Wkr61nOdI+lQipWGPVP+XH7WfNuL6ksRBOB1ovAdENIa7U+qNyt4rf4aPpOMv1MN5FcKz3oMsUcyF9akxSJmJ5CcTnaKPYV6UJIhV+Vbo90d8b0AlMParsPzFLW6EkfOWaxxyZkmWmxONZCX7FWSNmYnJkQgD8uN7PSer6orcwXlsp4Bx5wp3xrt7sDvA6Asc9lHjt2Lwne1sVZVazqWzprcehHPzJXs90IXrxvvUg7kF0Z7DUFKo/BZxxJpoPA3kq7nuhMp9shf39mthzwHruRPPdn2Q/WmCAJ41/Zcc5H6gDRYWb+rmJ2YUKPwNjSJz8KGtSp/oQlqa6QcyFsB64XKD+Zbo/1Z9dxM0O9B9vE5HEmHUjij/ZDq9dbXMikKQPLjKqv+zLXKH3PinZVSXkttqrbnmovUh9RZR+RKp52sc5SUA/m+1Zjov6jIrJ/PxewEktfKTrH/ovI/JyjfQqefKR8ahL+K+ymAdw+yn6cPIsutBrOea4tIfZiaNW58FAuJHzmj/ZitfydJOZCX7F/Utco9GqSVX1ENcfG6gQzsOpKuUz3FIVEuZ7TvM1HVKnw/tb4ngDqt1V/4jonx8lmZFy+qY0W+FfHHvqz0einyXvnUA/mF7PSFLl43ojmX/XM9yj9ogI/mkr4b10ixRwmc0b5PumtrtPc9hAHUyYnCdzVrjfZatmH1FblbROxHDnbV8ImWwZN6IC/ZgW2J+5bu5Gd+Q7qI/UBeOtkTXpfivYO8rRQeXO86U75ReL8jtUYAWPpW3l2sTiC6VvZqdA0TvzOFi8JKdfz8x3BG+66xyaByCOSd7CClpH1LV/IzviHsTUGfXSn29yp3Kwrq4Iz2vslca0DOoASAZSk7y+1a9RyBXJNz2c+FWsbf1vOSejK2hfzCQEi0rTg5BPJS/76lUgZlrudaF6kPyNdCdtVdiSPpkDencCGqvsIyVpG7WtIkARynE4XvatLJXo3v4nVjMo36j7xmW6+t7yi6KFnjuQTyc9n7lm6V/wypk53S8k11zAbidJ3s2cG+Sa9mjM4AA7MC8NZoC21TYlACYJe17ADurOdaTTY1nVr5jL9cJzdmkr4a176rjvF33+pxKYulY5nLnvSLsiqfSyAv9R+19Yfyrc7dyk9GhLyIDxEO08r+nNzKTxo1H9qc7LoMQEqse+G9/MN0M5Ds5J8Jh3wPAPjoQfbE+FflO+Ycwo18gHsvf6/9Uz4rMLdg/lz2BPGr6piwOZe9GPqkOqr1n2It+z10rQj3iZwC+ZX6P1QL5XdjbWUPODfXWT3CIZbq/5zcSvqPpL/e/liTSEBqlrLrpXyR9F/597RVa6SWI4QADIOVys8aSf/S51T0S+UVzJ/L99dKqb9RHePvVhw5d6qu59roq/I5BfKSv3H+MK6dKa9gvlV/EP9NHPeA4zzI3ooC5OyUwXOtA28Ax1nIPmKq1sJ3Tc+1TTDf9zUp2ATx1pbW76pn/E2Ru9Ot1L/9e9TJrdwCecnfOK10p00wn/qxdJ36g/hH1ZHSg/G0slPsgVydUqjODdUJANXoROG7j1Y7rl/KZz6luqi2K4j/oYgVxyd2I3trJRPfh3E910Z9P+UYyK/li1NYN9Yz+bSfFG+wmxuIlfop+UmKWm4iGM9Kda4WoGwr2VlZfR5VR5okgGGtZAc1Zz3XSrWS9NuOrzmT9G+lN5a9kp9ksIL4Z9U1bur793GxOlEIJ3vrXzvmC+cYyEu7g3nJFyNZKp3zs1v5G+B1z9c8y/eXASeGMNdxQQ+QMnfE3+HIOQDH6mQP0m+VzjgzFqfdwbwk/a50Uu3v5CcXrBXo2sbfjex45IfqqNY/NGe0X2jEYD7XQF7yQXojO81e8r+8P/VzRePYGvkb2R+yC0pI/oMzUz03EcTRyh6AADnqO+4l5EUE8gBO0/Zcq21VXvJByy/afS++li+w22macfhMPl74vedrHlXf+LvruVbj+3kIrufaaNkpfxvrG0eyWZmfq3+l+4v8L7Ebv0ufOPX3TfKFNVJLQUIZ1vIDkD8n7gcwJCf77N/Q12IaV0q/Zs3QVvJjkpqCghos5AtahcZzl/JjuNoCoIX8Z3wuO119417vvyOn8Vd8Z/Jj/l3j72+qrybVufqPvV7E60pRVvKTQqHf7aX8e3Ix9Iv+319//TX095xKp/6955L0d8VNF7mST+WxvMoHWawWnS70Rq7xBm150P6Bj+QHLLNxupK10PuM31V8u+6tH8W+78O7ka9XU6NnpVvsa0wzhSeNS3kWN/KryyGvb9drncDptHsM/tEP+bHvkJNejfx9p9XuiYWXt6+t8UjSTva/1T9V34TUkGayF84eNUKKfc6p9ds6Sf9Qf6p9E6Un7/rSiH7I94cgHjF06v9sADlZar/3M3v9plNzltlm9QVlWclPSoScqa5Cads6+TH4vkfffpHfcvpf+VXKTj6wbg54zebt7zzIPxP+I59CvyuI/6b3wnc1mvVcc5H6UKqF+utpDC731PptmyMvOvlBRN+e9Km8yPeNAH5Yr0rz3zsVmxT7fVcxa11V2OVFn4vlrCboB/zgre8YT4lByZRqv4fU+PNbgdEqZidG9iD/LA0VTavx3/yjTYHpVn4cbhWW23atzynwL+p/3+xKmQ/ZHO3c931rxukuw3hQuCbDKEdCl7Qi/1EnP1P3OG03fvIiPwvYiCB+DNurPy8iPWjbUtKv2l387lVlpEGOodv6f35X03Hy7+fQw/H17Rr32ul0GmngkoFH1bnat5av+fPRs8r6HK7lV4G3V55L+zlP4eTHur/q+JNzLvQe4If+HOJRfotVK4J4KXxv/qa6M0qG9CC/RWH7dzxKllpJe+Qt5/Jvzru3/y4ivvZM76vvLuLr1qrRe1rWYrJe5GHWc20pZmX7NOJ9lpJGn9MxeQ+n4Vz17RVfq84g/qMrvW8tXEzYj7HV8nOeqtH+e9eHslnMceJZEPLx3rwSExxjaPQ+NllppN9xDYE8AAAAgGk18gsJmz/7pt/v40l+4WwhJtNQCQJ5AAAAALFtVoZn+nmV+Ep23aNnvWe+rN7+uxixj0CyCOQBAAAAAMhIqcXuAAAAAAAoEoE8AAAAAAAZIZAHAAAAACAjBPIAAAAAAGSEQB4AAAAAgIwQyAMAAAAAkBECeQAAAAAAMkIgDwAAAABARgjkAQAAAADICIE8AAAAAAAZIZAHAAAAACAjBPIAAAAAAGSEQB4AAAAAgIwQyAMAAAAAkBECeQAAAAAAMkIgDwAAAABARgjkAQAAAADICIE8AAAAAAAZIZAHAAAAACAjBPIAAAAAAGSEQB4AAAAAgIwQyAMAAAAAkJH/B1CENkvtJPJ+AAAAAElFTkSuQmCC";

export default async function Image({ params }: { params: Promise<{ client: string }> }) {
  const { client } = await params;
  const clientSlug = client?.toLowerCase();
  const proposal = (proposalsData as any)[clientSlug];
  
  const clientName = proposal ? proposal.client : "Universa Agency";
  const proposalTitle = proposal ? (proposal.title || "Propuesta Estratégica") : "High Performance Digital Infrastructure";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0e131f", // Universa Deep Midnight Blue
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "white",
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Background Ambient Radial Green Lights (Top Left & Bottom Right) */}
        <div
          style={{
            position: "absolute",
            top: "-180px",
            left: "-150px",
            width: "650px",
            height: "650px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(45, 220, 128, 0.45) 0%, rgba(45, 220, 128, 0.08) 55%, transparent 70%)",
            display: "flex",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "-220px",
            right: "-150px",
            width: "750px",
            height: "750px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(45, 220, 128, 0.35) 0%, rgba(45, 220, 128, 0.05) 55%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Center Emerald Glow Beam */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "850px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(45, 220, 128, 0.18) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Top Border Accent Line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent 0%, #2ddc80 50%, transparent 100%)",
            display: "flex",
          }}
        />

        {/* Top Header Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 22px",
            background: "rgba(45, 220, 128, 0.1)",
            border: "1px solid rgba(45, 220, 128, 0.3)",
            borderRadius: "9999px",
            marginBottom: "16px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#2ddc80",
              boxShadow: "0 0 10px #2ddc80",
              display: "flex",
            }}
          />
          <span
            style={{
              color: "#2ddc80",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
            }}
          >
            UNIVERSA AGENCY · PROPUESTA ESTRATÉGICA
          </span>
        </div>

        {/* Official Universa Logo Image (Aspect ratio 1010 x 719 => 210 x 150) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={UNIVERSA_LOGO_BASE64}
          alt="Universa Agency Logo"
          width="210"
          height="150"
          style={{
            marginBottom: "8px",
            zIndex: 10,
            filter: "drop-shadow(0 0 25px rgba(45,220,128,0.5))",
          }}
        />

        {/* Client Name Main Heading */}
        <div
          style={{
            marginTop: "12px",
            fontSize: clientName.length > 20 ? "54px" : "66px",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "#FFFFFF",
            textAlign: "center",
            padding: "0 60px",
            lineHeight: 1.05,
            textTransform: "uppercase",
            zIndex: 10,
            textShadow: "0 10px 30px rgba(0,0,0,0.6)",
          }}
        >
          {clientName}
        </div>

        {/* Subtitle / Proposal Title */}
        <div
          style={{
            marginTop: "14px",
            fontSize: "16px",
            fontWeight: 700,
            color: "rgba(255, 255, 255, 0.65)",
            textAlign: "center",
            maxWidth: "920px",
            padding: "0 40px",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            zIndex: 10,
          }}
        >
          {proposalTitle.length > 90 ? proposalTitle.slice(0, 90) + "..." : proposalTitle}
        </div>

        {/* Bottom Footer Accent */}
        <div
          style={{
            position: "absolute",
            bottom: "22px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            zIndex: 10,
          }}
        >
          <span style={{ color: "rgba(255, 255, 255, 0.35)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            UNIVERSAAGENCY.COM
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
