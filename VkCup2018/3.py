import networkx as nx
from networkx.exception import NetworkXNoPath

G = nx.DiGraph()
n = int(input())
projs = {}

def sh(i, j):
    return i*n + j

root = None
for i in range(n):
    ipt = input()
    G.add_node(ipt)
    proj, ver = ipt.split()
    ver = int(ver)
    if i == 0:
        root = ipt
    projs[proj] = projs.get(proj, {})
    projs[proj][ver] = True
    rel_n = int(input())
    for j in range(rel_n):
        rel = input()
        rel_name, rel_ver = rel.split()
        rel_ver = int(rel_ver)
        projs[rel_name] = projs.get(rel_name, {})
        projs[rel_name][rel_ver] = True
        G.add_edge(ipt, rel)
    input()

for k in projs.keys():
    if len(projs[k].keys()) == 1:
        projs[k] = list(projs[k].keys())[0]
    else:
        min_l = float('inf')
        min_v = 0
        for p in projs[k].keys():
            try:
                l = nx.shortest_path_length(G, source=root, target=(k + ' ' + str(p)))
            except NetworkXNoPath:
                continue
            if min_l > l:
                min_l = l
                min_v = p
            elif min_l == l and min_v < p:
                min_v = p
        projs[k] = min_v

na, _ = root.split()
del(projs[na])

print(len(projs.keys()))
for i in sorted(projs.keys()):
    print(i, projs[i])
