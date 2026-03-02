export type LearningTopic = {
  id: string;
  title: string;
  explanation: string;
  complexity: {
    time: string;
    space: string;
  };
  snippets: Record<string, string>;
};

export type LearningGroup = {
  id: "algorithms" | "data-structures";
  title: string;
  description: string;
  items: LearningTopic[];
};

const fallbackSnippet = (title: string) =>
  `// Minimal ${title} snippet is not defined for this language yet.`;

export const learningGroups: LearningGroup[] = [
  {
    id: "algorithms",
    title: "Algorithms",
    description:
      "Core problem-solving strategies for interviews and real systems. Focus on patterns, not memorization.",
    items: [
      {
        id: "binary-search-answer",
        title: "Binary search and search on answer",
        explanation:
          "Use binary search on sorted data or on a monotonic predicate. Search-on-answer works when feasibility flips from false to true.",
        complexity: {
          time: "O(log N) checks",
          space: "O(1)"
        },
        snippets: {
          python: `def first_true(lo, hi, ok):
    while lo < hi:
        mid = (lo + hi) // 2
        if ok(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo`,
          javascript: `function firstTrue(lo, hi, ok) {
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (ok(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
          typescript: `function firstTrue(lo: number, hi: number, ok: (x: number) => boolean): number {
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (ok(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
          java: `static int firstTrue(int lo, int hi, java.util.function.IntPredicate ok) {
  while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (ok.test(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
          cpp: `int firstTrue(int lo, int hi, function<bool(int)> ok) {
  while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (ok(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
          csharp: `static int FirstTrue(int lo, int hi, Func<int, bool> ok) {
  while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (ok(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
          go: `func firstTrue(lo, hi int, ok func(int) bool) int {
  for lo < hi {
    mid := lo + (hi-lo)/2
    if ok(mid) {
      hi = mid
    } else {
      lo = mid + 1
    }
  }
  return lo
}`,
          rust: `fn first_true(mut lo: i32, mut hi: i32, ok: impl Fn(i32) -> bool) -> i32 {
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if ok(mid) { hi = mid; } else { lo = mid + 1; }
    }
    lo
}`,
          sql: `-- Conceptual search-on-answer with a monotonic predicate.
WITH RECURSIVE bounds(lo, hi, step) AS (
  VALUES (1, 1000000, 0)
  UNION ALL
  SELECT
    CASE WHEN mid * mid >= 500 THEN lo ELSE mid + 1 END,
    CASE WHEN mid * mid >= 500 THEN mid ELSE hi END,
    step + 1
  FROM (SELECT lo, hi, (lo + hi) / 2 AS mid, step FROM bounds) s
  WHERE lo < hi AND step < 60
)
SELECT lo AS answer FROM bounds ORDER BY step DESC LIMIT 1;`
        }
      },
      {
        id: "two-pointers-sliding-window",
        title: "Two pointers and sliding window",
        explanation:
          "Grow and shrink a window while maintaining an invariant. Great for substring/subarray constraints and pair problems.",
        complexity: {
          time: "O(N)",
          space: "O(1) to O(K)"
        },
        snippets: {
          python: `def longest_at_most_k(nums, k):
    left = total = best = 0
    for right, x in enumerate(nums):
        total += x
        while total > k:
            total -= nums[left]
            left += 1
        best = max(best, right - left + 1)
    return best`,
          javascript: `function longestAtMostK(nums, k) {
  let left = 0, sum = 0, best = 0;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum > k) sum -= nums[left++];
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
          typescript: `function longestAtMostK(nums: number[], k: number): number {
  let left = 0, sum = 0, best = 0;
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum > k) sum -= nums[left++];
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
          java: `static int longestAtMostK(int[] nums, int k) {
  int left = 0, sum = 0, best = 0;
  for (int right = 0; right < nums.length; right++) {
    sum += nums[right];
    while (sum > k) sum -= nums[left++];
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
          cpp: `int longestAtMostK(vector<int>& nums, int k) {
  int left = 0, sum = 0, best = 0;
  for (int right = 0; right < (int)nums.size(); right++) {
    sum += nums[right];
    while (sum > k) sum -= nums[left++];
    best = max(best, right - left + 1);
  }
  return best;
}`,
          csharp: `static int LongestAtMostK(int[] nums, int k) {
  int left = 0, sum = 0, best = 0;
  for (int right = 0; right < nums.Length; right++) {
    sum += nums[right];
    while (sum > k) sum -= nums[left++];
    best = Math.Max(best, right - left + 1);
  }
  return best;
}`,
          go: `func longestAtMostK(nums []int, k int) int {
  left, sum, best := 0, 0, 0
  for right, x := range nums {
    sum += x
    for sum > k {
      sum -= nums[left]
      left++
    }
    if right-left+1 > best {
      best = right - left + 1
    }
  }
  return best
}`,
          rust: `fn longest_at_most_k(nums: &[i32], k: i32) -> usize {
    let (mut left, mut sum, mut best) = (0usize, 0i32, 0usize);
    for right in 0..nums.len() {
        sum += nums[right];
        while sum > k { sum -= nums[left]; left += 1; }
        best = best.max(right - left + 1);
    }
    best
}`,
          sql: `-- Sliding window style aggregate with SQL window functions.
SELECT
  idx,
  value,
  SUM(value) OVER (ORDER BY idx ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS window_sum
FROM stream_values
ORDER BY idx;`
        }
      },
      {
        id: "dfs-bfs-graphs-trees",
        title: "DFS and BFS on graphs and trees",
        explanation:
          "DFS explores depth-first with recursion/stack; BFS explores level-by-level with a queue. Use visited tracking to avoid repeats.",
        complexity: {
          time: "O(V + E)",
          space: "O(V)"
        },
        snippets: {
          python: `from collections import deque

def bfs(start, graph):
    q, seen = deque([start]), {start}
    while q:
        u = q.popleft()
        for v in graph[u]:
            if v not in seen:
                seen.add(v)
                q.append(v)`,
          javascript: `function bfs(start, graph) {
  const q = [start];
  const seen = new Set([start]);
  while (q.length) {
    const u = q.shift();
    for (const v of graph[u]) if (!seen.has(v)) {
      seen.add(v);
      q.push(v);
    }
  }
}`,
          typescript: `function bfs(start: number, graph: number[][]): void {
  const q: number[] = [start];
  const seen = new Set<number>([start]);
  while (q.length > 0) {
    const u = q.shift()!;
    for (const v of graph[u]) if (!seen.has(v)) {
      seen.add(v);
      q.push(v);
    }
  }
}`,
          java: `static void bfs(int start, List<List<Integer>> graph) {
  Queue<Integer> q = new ArrayDeque<>();
  Set<Integer> seen = new HashSet<>();
  q.offer(start);
  seen.add(start);
  while (!q.isEmpty()) {
    int u = q.poll();
    for (int v : graph.get(u)) if (seen.add(v)) q.offer(v);
  }
}`,
          cpp: `void bfs(int start, vector<vector<int>>& graph) {
  queue<int> q;
  vector<int> seen(graph.size(), 0);
  q.push(start);
  seen[start] = 1;
  while (!q.empty()) {
    int u = q.front(); q.pop();
    for (int v : graph[u]) if (!seen[v]) {
      seen[v] = 1;
      q.push(v);
    }
  }
}`,
          csharp: `static void Bfs(int start, List<int>[] graph) {
  var q = new Queue<int>();
  var seen = new HashSet<int> { start };
  q.Enqueue(start);
  while (q.Count > 0) {
    int u = q.Dequeue();
    foreach (var v in graph[u]) if (seen.Add(v)) q.Enqueue(v);
  }
}`,
          go: `func bfs(start int, graph [][]int) {
  q := []int{start}
  seen := map[int]bool{start: true}
  for len(q) > 0 {
    u := q[0]
    q = q[1:]
    for _, v := range graph[u] {
      if !seen[v] {
        seen[v] = true
        q = append(q, v)
      }
    }
  }
}`,
          rust: `use std::collections::{HashSet, VecDeque};

fn bfs(start: usize, graph: &[Vec<usize>]) {
    let mut q = VecDeque::from([start]);
    let mut seen = HashSet::from([start]);
    while let Some(u) = q.pop_front() {
        for &v in &graph[u] {
            if seen.insert(v) { q.push_back(v); }
        }
    }
}`,
          sql: `-- BFS-style traversal with recursive CTE.
WITH RECURSIVE bfs(node, depth) AS (
  SELECT 1, 0
  UNION ALL
  SELECT e.to_node, bfs.depth + 1
  FROM bfs
  JOIN edges e ON e.from_node = bfs.node
)
SELECT node, MIN(depth) AS depth
FROM bfs
GROUP BY node
ORDER BY depth, node;`
        }
      },
      {
        id: "dp-memo-tab",
        title: "Dynamic programming with memoization and tabulation",
        explanation:
          "Memoization caches recursive subproblems. Tabulation builds answers bottom-up. Pick whichever gives clearer state transitions.",
        complexity: {
          time: "Usually O(states * transitions)",
          space: "O(states)"
        },
        snippets: {
          python: `from functools import lru_cache

@lru_cache(None)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

def fib_tab(n):
    dp = [0, 1] + [0] * max(0, n - 1)
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]`,
          javascript: `const memo = new Map();
function fib(n) {
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n);
  const ans = fib(n - 1) + fib(n - 2);
  memo.set(n, ans);
  return ans;
}`,
          typescript: `const memo = new Map<number, number>();
function fib(n: number): number {
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n)!;
  const ans = fib(n - 1) + fib(n - 2);
  memo.set(n, ans);
  return ans;
}`,
          java: `static int fibMemo(int n, int[] memo) {
  if (n < 2) return n;
  if (memo[n] != -1) return memo[n];
  return memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
}`,
          cpp: `int fibMemo(int n, vector<int>& memo) {
  if (n < 2) return n;
  if (memo[n] != -1) return memo[n];
  return memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
}`,
          csharp: `static int FibMemo(int n, Dictionary<int, int> memo) {
  if (n < 2) return n;
  if (memo.TryGetValue(n, out var hit)) return hit;
  int ans = FibMemo(n - 1, memo) + FibMemo(n - 2, memo);
  memo[n] = ans;
  return ans;
}`,
          go: `func fibMemo(n int, memo map[int]int) int {
  if n < 2 {
    return n
  }
  if v, ok := memo[n]; ok {
    return v
  }
  memo[n] = fibMemo(n-1, memo) + fibMemo(n-2, memo)
  return memo[n]
}`,
          rust: `use std::collections::HashMap;

fn fib_memo(n: i32, memo: &mut HashMap<i32, i32>) -> i32 {
    if n < 2 { return n; }
    if let Some(v) = memo.get(&n) { return *v; }
    let ans = fib_memo(n - 1, memo) + fib_memo(n - 2, memo);
    memo.insert(n, ans);
    ans
}`,
          sql: `-- Tabulation style with recursive CTE (Fibonacci).
WITH RECURSIVE fib(i, a, b) AS (
  VALUES (0, 0, 1)
  UNION ALL
  SELECT i + 1, b, a + b
  FROM fib
  WHERE i < 10
)
SELECT i, a AS fib_i FROM fib;`
        }
      },
      {
        id: "union-find-topological-sort",
        title: "Union Find and topological sort",
        explanation:
          "Union Find tracks connected components efficiently. Topological sort orders DAG nodes so every edge points forward.",
        complexity: {
          time: "Union-Find ~O(alpha(N)); Topo O(V + E)",
          space: "O(V)"
        },
        snippets: {
          python: `from collections import deque

parent = list(range(6))

def find(x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]
        x = parent[x]
    return x

def union(a, b):
    ra, rb = find(a), find(b)
    if ra != rb:
        parent[rb] = ra`,
          javascript: `const parent = Array.from({ length: 6 }, (_, i) => i);
const find = (x) => parent[x] === x ? x : (parent[x] = find(parent[x]));
const union = (a, b) => {
  const ra = find(a), rb = find(b);
  if (ra !== rb) parent[rb] = ra;
};`,
          typescript: `const parent: number[] = Array.from({ length: 6 }, (_, i) => i);
const find = (x: number): number => parent[x] === x ? x : (parent[x] = find(parent[x]));
const union = (a: number, b: number): void => {
  const ra = find(a), rb = find(b);
  if (ra !== rb) parent[rb] = ra;
};`,
          java: `static int find(int x, int[] parent) {
  if (parent[x] != x) parent[x] = find(parent[x], parent);
  return parent[x];
}
static void union(int a, int b, int[] parent) {
  int ra = find(a, parent), rb = find(b, parent);
  if (ra != rb) parent[rb] = ra;
}`,
          cpp: `int find(int x, vector<int>& p) {
  return p[x] == x ? x : p[x] = find(p[x], p);
}
void unite(int a, int b, vector<int>& p) {
  a = find(a, p); b = find(b, p);
  if (a != b) p[b] = a;
}`,
          csharp: `static int Find(int x, int[] parent) {
  if (parent[x] != x) parent[x] = Find(parent[x], parent);
  return parent[x];
}
static void Union(int a, int b, int[] parent) {
  int ra = Find(a, parent), rb = Find(b, parent);
  if (ra != rb) parent[rb] = ra;
}`,
          go: `func find(x int, parent []int) int {
  if parent[x] != x {
    parent[x] = find(parent[x], parent)
  }
  return parent[x]
}
func union(a, b int, parent []int) {
  ra, rb := find(a, parent), find(b, parent)
  if ra != rb {
    parent[rb] = ra
  }
}`,
          rust: `fn find(x: usize, parent: &mut [usize]) -> usize {
    if parent[x] != x {
        let root = find(parent[x], parent);
        parent[x] = root;
    }
    parent[x]
}`,
          sql: `-- Conceptual topological ordering with recursive CTE.
WITH RECURSIVE topo(node, depth) AS (
  SELECT n.id, 0
  FROM nodes n
  WHERE NOT EXISTS (SELECT 1 FROM edges e WHERE e.to_id = n.id)
  UNION ALL
  SELECT e.to_id, topo.depth + 1
  FROM topo
  JOIN edges e ON e.from_id = topo.node
)
SELECT node
FROM topo
ORDER BY depth, node;`
        }
      }
    ]
  },
  {
    id: "data-structures",
    title: "Data structures",
    description:
      "Pick structures based on operations you need most. Correct structure choice often beats micro-optimizations.",
    items: [
      {
        id: "hash-map-hash-set",
        title: "Hash map and hash set",
        explanation:
          "Hash map stores key-value pairs with expected O(1) operations. Hash set stores unique items and fast membership checks.",
        complexity: {
          time: "Expected O(1) insert/find/delete",
          space: "O(N)"
        },
        snippets: {
          python: `nums = [1, 2, 2, 3]
seen = set()
freq = {}
for x in nums:
    seen.add(x)
    freq[x] = freq.get(x, 0) + 1`,
          javascript: `const nums = [1, 2, 2, 3];
const seen = new Set();
const freq = new Map();
for (const x of nums) {
  seen.add(x);
  freq.set(x, (freq.get(x) ?? 0) + 1);
}`,
          typescript: `const nums: number[] = [1, 2, 2, 3];
const seen = new Set<number>();
const freq = new Map<number, number>();
for (const x of nums) {
  seen.add(x);
  freq.set(x, (freq.get(x) ?? 0) + 1);
}`,
          java: `int[] nums = {1, 2, 2, 3};
Set<Integer> seen = new HashSet<>();
Map<Integer, Integer> freq = new HashMap<>();
for (int x : nums) {
  seen.add(x);
  freq.put(x, freq.getOrDefault(x, 0) + 1);
}`,
          cpp: `vector<int> nums = {1, 2, 2, 3};
unordered_set<int> seen;
unordered_map<int, int> freq;
for (int x : nums) {
  seen.insert(x);
  freq[x]++;
}`,
          csharp: `int[] nums = {1, 2, 2, 3};
var seen = new HashSet<int>();
var freq = new Dictionary<int, int>();
foreach (var x in nums) {
  seen.Add(x);
  freq[x] = freq.TryGetValue(x, out var c) ? c + 1 : 1;
}`,
          go: `nums := []int{1, 2, 2, 3}
seen := map[int]bool{}
freq := map[int]int{}
for _, x := range nums {
  seen[x] = true
  freq[x]++
}`,
          rust: `use std::collections::{HashMap, HashSet};

let nums = vec![1, 2, 2, 3];
let mut seen = HashSet::new();
let mut freq = HashMap::new();
for x in nums {
    seen.insert(x);
    *freq.entry(x).or_insert(0) += 1;
}`,
          sql: `-- Hash-map-like frequency table + set-style uniqueness.
SELECT value, COUNT(*) AS freq
FROM nums
GROUP BY value;

SELECT DISTINCT value
FROM nums;`
        }
      },
      {
        id: "heap-priority-queue",
        title: "Heap and priority queue",
        explanation:
          "Use a heap when you repeatedly need min/max elements under dynamic inserts. Perfect for top-k and shortest-path variants.",
        complexity: {
          time: "O(log N) push/pop, O(1) peek",
          space: "O(N)"
        },
        snippets: {
          python: `import heapq

pq = []
heapq.heappush(pq, (2, "write tests"))
heapq.heappush(pq, (1, "fix bug"))
priority, task = heapq.heappop(pq)`,
          javascript: `class MinHeap {
  constructor() { this.a = []; }
  push(x) { this.a.push(x); this.a.sort((u, v) => u - v); }
  pop() { return this.a.shift(); }
}
const pq = new MinHeap();`,
          typescript: `class MinHeap {
  private a: number[] = [];
  push(x: number): void { this.a.push(x); this.a.sort((u, v) => u - v); }
  pop(): number | undefined { return this.a.shift(); }
}
const pq = new MinHeap();`,
          java: `PriorityQueue<Integer> pq = new PriorityQueue<>();
pq.offer(2);
pq.offer(1);
int smallest = pq.poll();`,
          cpp: `priority_queue<int, vector<int>, greater<int>> pq;
pq.push(2);
pq.push(1);
int smallest = pq.top();
pq.pop();`,
          csharp: `var pq = new PriorityQueue<string, int>();
pq.Enqueue("write tests", 2);
pq.Enqueue("fix bug", 1);
string next = pq.Dequeue();`,
          go: `// Uses container/heap in real projects.
pq := []int{2, 1}
sort.Ints(pq)
smallest := pq[0]
pq = pq[1:]`,
          rust: `use std::cmp::Reverse;
use std::collections::BinaryHeap;

let mut pq = BinaryHeap::new();
pq.push(Reverse(2));
pq.push(Reverse(1));
let smallest = pq.pop();`,
          sql: `-- Priority queue behavior: always pull smallest priority first.
SELECT task, priority
FROM jobs
ORDER BY priority ASC, created_at ASC
LIMIT 1;`
        }
      },
      {
        id: "stack-monotonic-stack",
        title: "Stack and monotonic stack",
        explanation:
          "Regular stack handles LIFO workflows. Monotonic stacks maintain order to solve next-greater/smaller span problems in linear time.",
        complexity: {
          time: "O(N) for monotonic scans",
          space: "O(N)"
        },
        snippets: {
          python: `def next_greater(nums):
    res = [-1] * len(nums)
    st = []
    for i, x in enumerate(nums):
        while st and nums[st[-1]] < x:
            res[st.pop()] = x
        st.append(i)
    return res`,
          javascript: `function nextGreater(nums) {
  const res = Array(nums.length).fill(-1);
  const st = [];
  nums.forEach((x, i) => {
    while (st.length && nums[st[st.length - 1]] < x) res[st.pop()] = x;
    st.push(i);
  });
  return res;
}`,
          typescript: `function nextGreater(nums: number[]): number[] {
  const res = Array(nums.length).fill(-1);
  const st: number[] = [];
  nums.forEach((x, i) => {
    while (st.length && nums[st[st.length - 1]] < x) res[st.pop()!] = x;
    st.push(i);
  });
  return res;
}`,
          java: `static int[] nextGreater(int[] nums) {
  int[] res = new int[nums.length];
  Arrays.fill(res, -1);
  Deque<Integer> st = new ArrayDeque<>();
  for (int i = 0; i < nums.length; i++) {
    while (!st.isEmpty() && nums[st.peek()] < nums[i]) res[st.pop()] = nums[i];
    st.push(i);
  }
  return res;
}`,
          cpp: `vector<int> nextGreater(vector<int>& nums) {
  vector<int> res(nums.size(), -1), st;
  for (int i = 0; i < (int)nums.size(); i++) {
    while (!st.empty() && nums[st.back()] < nums[i]) {
      res[st.back()] = nums[i];
      st.pop_back();
    }
    st.push_back(i);
  }
  return res;
}`,
          csharp: `static int[] NextGreater(int[] nums) {
  var res = Enumerable.Repeat(-1, nums.Length).ToArray();
  var st = new Stack<int>();
  for (int i = 0; i < nums.Length; i++) {
    while (st.Count > 0 && nums[st.Peek()] < nums[i]) res[st.Pop()] = nums[i];
    st.Push(i);
  }
  return res;
}`,
          go: `func nextGreater(nums []int) []int {
  res := make([]int, len(nums))
  for i := range res { res[i] = -1 }
  st := []int{}
  for i, x := range nums {
    for len(st) > 0 && nums[st[len(st)-1]] < x {
      j := st[len(st)-1]
      st = st[:len(st)-1]
      res[j] = x
    }
    st = append(st, i)
  }
  return res
}`,
          rust: `fn next_greater(nums: &[i32]) -> Vec<i32> {
    let mut res = vec![-1; nums.len()];
    let mut st: Vec<usize> = vec![];
    for i in 0..nums.len() {
        while st.last().is_some_and(|&j| nums[j] < nums[i]) {
            let j = st.pop().unwrap();
            res[j] = nums[i];
        }
        st.push(i);
    }
    res
}`,
          sql: `-- Next greater element concept with correlated subquery.
SELECT
  a.idx,
  (
    SELECT b.value
    FROM nums b
    WHERE b.idx > a.idx AND b.value > a.value
    ORDER BY b.idx
    LIMIT 1
  ) AS next_greater
FROM nums a
ORDER BY a.idx;`
        }
      },
      {
        id: "trie",
        title: "Trie",
        explanation:
          "Trie stores strings by prefix paths. Useful for autocomplete, prefix counts, and dictionary-style lookups.",
        complexity: {
          time: "O(L) insert/search (L = word length)",
          space: "O(total characters)"
        },
        snippets: {
          python: `class Trie:
    def __init__(self):
        self.root = {}
    def insert(self, word):
        cur = self.root
        for ch in word:
            cur = cur.setdefault(ch, {})
        cur["#"] = True
    def search(self, word):
        cur = self.root
        for ch in word:
            if ch not in cur: return False
            cur = cur[ch]
        return "#" in cur`,
          javascript: `class Trie {
  constructor() { this.root = {}; }
  insert(word) {
    let cur = this.root;
    for (const ch of word) cur = cur[ch] ??= {};
    cur.end = true;
  }
}`,
          typescript: `type Node = { end?: boolean; [ch: string]: Node | boolean | undefined };
class Trie {
  private root: Node = {};
  insert(word: string): void {
    let cur: Node = this.root;
    for (const ch of word) cur = (cur[ch] as Node | undefined) ?? ((cur[ch] = {}) as Node);
    cur.end = true;
  }
}`,
          java: `static class Node {
  Map<Character, Node> next = new HashMap<>();
  boolean end = false;
}
Node root = new Node();
void insert(String s) {
  Node cur = root;
  for (char c : s.toCharArray()) cur = cur.next.computeIfAbsent(c, k -> new Node());
  cur.end = true;
}`,
          cpp: `struct Node {
  unordered_map<char, Node*> next;
  bool end = false;
};
Node* root = new Node();
void insert(const string& s) {
  Node* cur = root;
  for (char c : s) {
    if (!cur->next.count(c)) cur->next[c] = new Node();
    cur = cur->next[c];
  }
  cur->end = true;
}`,
          csharp: `class Node {
  public Dictionary<char, Node> Next = new();
  public bool End;
}
var root = new Node();
void Insert(string s) {
  var cur = root;
  foreach (var c in s) {
    if (!cur.Next.ContainsKey(c)) cur.Next[c] = new Node();
    cur = cur.Next[c];
  }
  cur.End = true;
}`,
          go: `type Node struct {
  next map[rune]*Node
  end  bool
}

func insert(root *Node, word string) {
  cur := root
  for _, ch := range word {
    if cur.next[ch] == nil {
      cur.next[ch] = &Node{next: map[rune]*Node{}}
    }
    cur = cur.next[ch]
  }
  cur.end = true
}`,
          rust: `use std::collections::HashMap;

#[derive(Default)]
struct Node {
    next: HashMap<char, Node>,
    end: bool,
}
fn insert(root: &mut Node, word: &str) {
    let mut cur = root;
    for ch in word.chars() { cur = cur.next.entry(ch).or_default(); }
    cur.end = true;
}`,
          sql: `-- SQL approximation for prefix search (not a trie in memory).
CREATE INDEX idx_words_word ON words(word);
SELECT word
FROM words
WHERE word LIKE 'pre%'
ORDER BY word
LIMIT 20;`
        }
      },
      {
        id: "segment-tree-fenwick",
        title: "Segment tree or Fenwick tree",
        explanation:
          "Fenwick tree is compact for prefix sums and point updates. Segment tree is more flexible for range queries and range updates.",
        complexity: {
          time: "O(log N) update/query",
          space: "Fenwick O(N), Segment tree O(4N)"
        },
        snippets: {
          python: `class Fenwick:
    def __init__(self, n):
        self.bit = [0] * (n + 1)
    def add(self, i, delta):
        i += 1
        while i < len(self.bit):
            self.bit[i] += delta
            i += i & -i
    def prefix(self, i):
        i += 1
        total = 0
        while i > 0:
            total += self.bit[i]
            i -= i & -i
        return total`,
          javascript: `class Fenwick {
  constructor(n) { this.bit = Array(n + 1).fill(0); }
  add(i, delta) {
    for (i++; i < this.bit.length; i += i & -i) this.bit[i] += delta;
  }
  prefix(i) {
    let sum = 0;
    for (i++; i > 0; i -= i & -i) sum += this.bit[i];
    return sum;
  }
}`,
          typescript: `class Fenwick {
  private bit: number[];
  constructor(n: number) { this.bit = Array(n + 1).fill(0); }
  add(i: number, delta: number): void {
    for (i++; i < this.bit.length; i += i & -i) this.bit[i] += delta;
  }
  prefix(i: number): number {
    let sum = 0;
    for (i++; i > 0; i -= i & -i) sum += this.bit[i];
    return sum;
  }
}`,
          java: `static class Fenwick {
  int[] bit;
  Fenwick(int n) { bit = new int[n + 1]; }
  void add(int i, int delta) { for (i++; i < bit.length; i += i & -i) bit[i] += delta; }
  int prefix(int i) {
    int sum = 0;
    for (i++; i > 0; i -= i & -i) sum += bit[i];
    return sum;
  }
}`,
          cpp: `struct Fenwick {
  vector<int> bit;
  Fenwick(int n) : bit(n + 1, 0) {}
  void add(int i, int delta) { for (++i; i < (int)bit.size(); i += i & -i) bit[i] += delta; }
  int prefix(int i) {
    int s = 0;
    for (++i; i > 0; i -= i & -i) s += bit[i];
    return s;
  }
};`,
          csharp: `class Fenwick {
  private int[] bit;
  public Fenwick(int n) { bit = new int[n + 1]; }
  public void Add(int i, int delta) { for (i++; i < bit.Length; i += i & -i) bit[i] += delta; }
  public int Prefix(int i) {
    int sum = 0;
    for (i++; i > 0; i -= i & -i) sum += bit[i];
    return sum;
  }
}`,
          go: `type Fenwick struct{ bit []int }

func NewFenwick(n int) *Fenwick { return &Fenwick{bit: make([]int, n+1)} }
func (f *Fenwick) Add(i, delta int) {
  for i++; i < len(f.bit); i += i & -i { f.bit[i] += delta }
}
func (f *Fenwick) Prefix(i int) int {
  sum := 0
  for i++; i > 0; i -= i & -i { sum += f.bit[i] }
  return sum
}`,
          rust: `struct Fenwick { bit: Vec<i64> }

impl Fenwick {
    fn new(n: usize) -> Self { Self { bit: vec![0; n + 1] } }
    fn add(&mut self, mut i: usize, delta: i64) {
        i += 1;
        while i < self.bit.len() { self.bit[i] += delta; i += i & (!i + 1); }
    }
}`,
          sql: `-- Prefix sums via SQL window function (Fenwick-style query goal).
SELECT
  idx,
  value,
  SUM(value) OVER (ORDER BY idx) AS prefix_sum
FROM nums
ORDER BY idx;`
        }
      }
    ]
  }
];

export function getTopicSnippet(topic: LearningTopic, languageSlug: string): string {
  return topic.snippets[languageSlug] ?? topic.snippets.python ?? fallbackSnippet(topic.title);
}
